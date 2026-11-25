#!/usr/bin/env python3
"""
bell_scheduler.py — VCS Classroom Bell Alert
Turns Shelly smart plugs ON before each bell, OFF at the bell.
Controls plugs via local HTTP (Gen4 RPC API) — no cloud account required.
Resolves plug IPs by MAC address via the Windows ARP table, re-resolving
before each bell so mid-day hotspot restarts are handled automatically.
Stale ARP entries are cleaned up by clear-stale-arp.ps1 at startup.
Runs continuously; auto-started via Windows Startup folder.
"""

import os
import re
import sys
import time
import logging
import importlib
import subprocess
import requests

# Suppress console windows when shelling out from pythonw.exe (no console host).
_NO_WINDOW = subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
from datetime import datetime, timedelta, date

from dotenv import load_dotenv

import config as _cfg
from config import LOG_FILE   # needed at startup for logging setup

# ── Load credentials ──────────────────────────────────────────────────────────
load_dotenv()

SHELLY_MACS = [m for m in [os.getenv("SHELLY_MAC_1"), os.getenv("SHELLY_MAC_2")] if m]

if not SHELLY_MACS:
    sys.exit("ERROR: No Shelly MACs found in .env — set SHELLY_MAC_1 (and optionally SHELLY_MAC_2).")

# ── Logging ───────────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("bell_alert")


# ── MAC → IP resolution (ARP fallback only) ───────────────────────────────────
def mac_to_ip(mac: str) -> str | None:
    """
    Look up the current IP for a MAC address in the Windows ARP table.
    Accepts either colon- or dash-separated MAC strings, any case.

    If multiple IPs map to the same MAC (stale static entries after a DHCP
    lease change), probes each candidate and returns the first live Shelly.
    """
    normalized = mac.lower().replace(":", "-")
    candidates: list[str] = []
    try:
        result = subprocess.run(["arp", "-a"], capture_output=True, text=True, timeout=5,
                                 creationflags=_NO_WINDOW)
        for line in result.stdout.splitlines():
            if normalized in line.lower():
                match = re.search(r"(\d+\.\d+\.\d+\.\d+)", line)
                if match:
                    ip = match.group(1)
                    if ip not in candidates:
                        candidates.append(ip)
    except Exception as exc:
        log.warning("ARP lookup failed for MAC %s: %s", mac, exc)
        return None

    if not candidates:
        return None
    if len(candidates) == 1:
        return candidates[0]

    # Multiple ARP entries — probe to find the live one
    log.warning("Multiple IPs for MAC %s: %s — probing for live device…", mac, candidates)
    for ip in candidates:
        try:
            r = requests.get(f"http://{ip}/rpc/Shelly.GetStatus", timeout=2)
            if r.ok:
                log.info("Live Shelly at %s (others are stale ARP entries)", ip)
                return ip
        except Exception:
            pass
    log.warning("No candidate responded — defaulting to %s", candidates[0])
    return candidates[0]


def resolve_ips(quiet: bool = False) -> list[str]:
    """
    Resolve all configured MAC addresses to their current IPs via the ARP table.
    Logs and skips any that aren't found. quiet=True skips the log lines
    (used by the once-a-minute health check).
    """
    ips = []
    for mac in SHELLY_MACS:
        ip = mac_to_ip(mac)
        if ip:
            if not quiet:
                log.info("Resolved  %-20s → %s", mac, ip)
            ips.append(ip)
        elif not quiet:
            log.error("MAC %s not in ARP table — plug offline or not yet connected", mac)
    return ips


# ── Schedule resolver ─────────────────────────────────────────────────────────
def get_today_bells() -> list[tuple[str, str]] | None:
    """
    Return the (on_time, off_time) bell list for today, or None if no school.
    SPECIAL_DAYS overrides the default weekday mapping.
    """
    today   = date.today()
    dow     = today.weekday()   # 0=Mon … 6=Sun
    special = _cfg.SPECIAL_DAYS.get(today)

    if special == "skip":
        return None
    if special and special in _cfg.SCHEDULES:
        return _cfg.SCHEDULES[special]
    if dow >= 5:
        return None

    key = _cfg.DAY_SCHEDULE.get(dow)
    return _cfg.SCHEDULES.get(key)


# ── Plug control ──────────────────────────────────────────────────────────────
def set_plugs(on: bool, ips: list[str], retries: int = 2):
    # Gen4 RPC API — Gen1 used /relay/0?turn=on
    on_bool = "true" if on else "false"
    label   = "ON" if on else "OFF"
    for ip in ips:
        for attempt in range(1, retries + 2):
            try:
                r = requests.get(f"http://{ip}/rpc/Switch.Set?id=0&on={on_bool}", timeout=5)
                if r.ok:
                    log.info("Plug %-15s → %s", ip, label)
                else:
                    log.warning("Plug %s → %s  (HTTP %s)", ip, label, r.status_code)
                break
            except Exception as exc:
                if attempt <= retries:
                    log.warning("Plug %s attempt %d failed: %s — retrying…", ip, attempt, exc)
                    time.sleep(2)
                else:
                    log.error("Plug %s FAILED after %d attempts: %s", ip, retries + 1, exc)


# ── Schedule builder ──────────────────────────────────────────────────────────
def build_events(bells: list[tuple[str, str]]) -> list[tuple[datetime, bool]]:
    today  = date.today()
    events = []
    for on_str, off_str in bells:
        on_h,  on_m  = map(int, on_str.split(":"))
        off_h, off_m = map(int, off_str.split(":"))
        on_dt  = datetime(today.year, today.month, today.day, on_h,  on_m)
        off_dt = datetime(today.year, today.month, today.day, off_h, off_m)
        events.append((on_dt,  True))
        events.append((off_dt, False))
    events.sort(key=lambda e: e[0])
    return events


# ── Health check + hotspot recovery ───────────────────────────────────────────
# The laptop's Wi-Fi card can stop broadcasting while Windows still reports the
# hotspot as On (seen 2026-11-24: plug and phones could not see the SSID for 2 h).
# Every minute during school hours we ask the plug for its status. After
# HEALTH_FAILS_BEFORE_RESET misses in a row we run reset-hotspot.ps1 (Wi-Fi radio
# off/on + hotspot restart), at most once per RESET_COOLDOWN. When the plug comes
# back we set it to whatever the schedule says right now, so a light stuck ON
# from a failed OFF gets turned off.
HEALTH_EVERY_S           = 60
HEALTH_FAILS_BEFORE_RESET = 3
RESET_COOLDOWN           = timedelta(minutes=10)
HEALTH_HOURS             = ("06:30", "15:30")
RESET_SCRIPT             = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reset-hotspot.ps1")

_health = {"last_check": None, "fails": 0, "last_reset": None, "was_down": False}


def _in_health_hours(now: datetime) -> bool:
    if now.weekday() >= 5:
        return False
    start, end = HEALTH_HOURS
    return start <= now.strftime("%H:%M") <= end


def plug_reachable(ip: str) -> bool:
    try:
        return requests.get(f"http://{ip}/rpc/Switch.GetStatus?id=0", timeout=3).ok
    except Exception:
        return False


def expected_state(now: datetime) -> bool:
    """True if the schedule says the light should be ON at this moment."""
    bells = get_today_bells() or []
    for on_str, off_str in bells:
        on_dt  = datetime.combine(now.date(), datetime.strptime(on_str,  "%H:%M").time())
        off_dt = datetime.combine(now.date(), datetime.strptime(off_str, "%H:%M").time())
        if on_dt <= now < off_dt:
            return True
    return False


def reset_hotspot(reason: str = "") -> None:
    log.warning("Running reset-hotspot.ps1%s", f" — {reason}" if reason else "")
    _health["last_reset"] = datetime.now()
    try:
        r = subprocess.run(
            ["powershell.exe", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass",
             "-File", RESET_SCRIPT],
            capture_output=True, text=True, timeout=120, creationflags=_NO_WINDOW)
        for line in (r.stdout or "").strip().splitlines():
            log.info("  %s", line.strip())
        if r.returncode != 0:
            log.warning("reset-hotspot.ps1 exited %d %s", r.returncode, (r.stderr or "").strip()[:300])
    except Exception as exc:
        log.error("reset-hotspot.ps1 failed to run: %s", exc)


def health_tick() -> None:
    """Called from wait loops. Cheap when it's not time to check."""
    now = datetime.now()
    if _health["last_check"] and (now - _health["last_check"]).total_seconds() < HEALTH_EVERY_S:
        return
    _health["last_check"] = now
    if not _in_health_hours(now) or get_today_bells() is None:
        _health["fails"] = 0
        return

    ips = [ip for ip in resolve_ips(quiet=True) if plug_reachable(ip)]
    if ips:
        if _health["was_down"]:
            want = expected_state(now)
            log.info("Plug back online at %s — setting it %s to match the schedule",
                     ips, "ON" if want else "OFF")
            set_plugs(want, ips)
        _health["fails"] = 0
        _health["was_down"] = False
        return

    _health["fails"] += 1
    _health["was_down"] = True
    log.warning("Health check: plug not answering (%d in a row)", _health["fails"])
    cooled = _health["last_reset"] is None or now - _health["last_reset"] >= RESET_COOLDOWN
    if _health["fails"] >= HEALTH_FAILS_BEFORE_RESET and cooled:
        reset_hotspot(f"plug unreachable for {_health['fails']} checks")


# ── Waiting ───────────────────────────────────────────────────────────────────
def wait_until(target: datetime, chunk_s: float = 30.0) -> None:
    """Sleep until the wall clock reaches `target`, in short chunks.

    One long time.sleep() does not count time the laptop spends asleep, so a
    10-hour "sleep until midnight" could still be waiting days later after the
    lid was closed over a weekend. Re-checking datetime.now() every chunk keeps
    us pinned to the real clock, so we catch up within 30 s of waking.
    """
    while True:
        remaining = (target - datetime.now()).total_seconds()
        if remaining <= 0:
            return
        time.sleep(min(remaining, chunk_s))
        try:
            health_tick()
        except Exception as exc:   # a health-check bug must never stop the bells
            log.error("Health check error: %s", exc)


def _day_label(d: date) -> str:
    # "%-d" is not supported on Windows — build the label by hand.
    return f"{d.strftime('%A %b')} {d.day}"


# ── Main loop ─────────────────────────────────────────────────────────────────
def run():
    log.info("Bell alert scheduler started  macs=%s", SHELLY_MACS)

    # Resolve IPs at startup — retry every 30 s indefinitely until the
    # hotspot and Shelly connect.  Never exit: the hotspot may take several
    # minutes to start (especially after a reboot), and we want the task to
    # stay "Running" in Task Scheduler rather than exiting and going to "Ready".
    shelly_ips = resolve_ips()
    attempt = 0
    while not shelly_ips:
        attempt += 1
        log.warning("No plugs resolved yet — waiting 30 s (attempt %d)…", attempt)
        wait_until(datetime.now() + timedelta(seconds=30))
        shelly_ips = resolve_ips()

    while True:
        now   = datetime.now()
        today = now.date()
        bells = get_today_bells()

        pending = [] if bells is None else [(dt, on) for dt, on in build_events(bells) if dt > now]

        if not pending:
            midnight = datetime(today.year, today.month, today.day) + timedelta(days=1, seconds=5)
            if bells is None:
                reason = "weekend" if today.weekday() >= 5 else "skip / no school"
                log.info("No bells today (%s) — sleeping until %s", reason, midnight.date())
            else:
                log.info("All bells done for today — sleeping until %s", midnight.date())
            wait_until(midnight)
            # New day (possibly several days later if the laptop slept): reload config
            # and re-resolve. Errors here must not kill the scheduler.
            try:
                importlib.reload(_cfg)
                log.info("Config reloaded for %s", _day_label(date.today()))
            except Exception as e:
                log.error("Config reload failed — keeping previous config: %s", e)
            shelly_ips = resolve_ips() or shelly_ips
            continue

        next_dt, next_on = pending[0]
        sleep_s = (next_dt - datetime.now()).total_seconds()

        if sleep_s > 0:
            log.info("Next event: %s %s  (in %.0f s)",
                     next_dt.strftime("%H:%M"), "ON" if next_on else "OFF", sleep_s)
            wait_until(next_dt - timedelta(seconds=1))

        while datetime.now() < next_dt:
            time.sleep(0.1)

        # Woke up long after this event (laptop was asleep)? Skip it instead of
        # flashing a stale bell; an ON whose OFF has also passed is pointless.
        if (datetime.now() - next_dt).total_seconds() > 120:
            log.warning("Missed %s %s (laptop asleep?) — skipping",
                        next_dt.strftime("%H:%M"), "ON" if next_on else "OFF")
            if not next_on:
                set_plugs(False, shelly_ips)   # make sure the light isn't left on
            continue

        # Re-resolve immediately before firing — IP may have changed since startup
        # if the hotspot restarted or a DHCP lease was renewed mid-day.
        fresh = resolve_ips()
        if fresh:
            if fresh != shelly_ips:
                log.info("IP change detected — was %s, now %s", shelly_ips, fresh)
            shelly_ips = fresh
        else:
            log.warning("Re-resolve failed before bell — retrying with cached IPs %s", shelly_ips)

        set_plugs(next_on, shelly_ips)


if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        log.info("Scheduler stopped by user.")
        # Best-effort turn-off on exit; re-resolve in case IPs shifted
        set_plugs(False, resolve_ips() or [])
