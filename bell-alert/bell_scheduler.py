#!/usr/bin/env python3
"""
bell_scheduler.py — VCS Classroom Bell Alert
Turns two Shelly smart plugs ON before each bell, OFF at the bell.
Controls plugs via local HTTP — no cloud account required.
Runs continuously; auto-started via Windows Startup folder.
"""

import os
import sys
import time
import logging
import requests
from datetime import datetime, timedelta, date

from dotenv import load_dotenv

from config import DAY_SCHEDULE, SCHEDULES, SPECIAL_DAYS, LOG_FILE

# ── Load credentials ──────────────────────────────────────────────────────────
load_dotenv()

SHELLY_IPS = [ip for ip in [os.getenv("SHELLY_IP_1"), os.getenv("SHELLY_IP_2")] if ip]

if not SHELLY_IPS:
    sys.exit("ERROR: No Shelly IPs found in .env — set SHELLY_IP_1 and SHELLY_IP_2.")

# ── Logging ───────────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("bell_alert")


# ── Schedule resolver ─────────────────────────────────────────────────────────
def get_today_bells() -> list[tuple[str, str]] | None:
    """
    Return the (on_time, off_time) bell list for today, or None if no school.
    SPECIAL_DAYS overrides the default weekday mapping.
    """
    today   = date.today()
    dow     = today.weekday()   # 0=Mon … 6=Sun
    special = SPECIAL_DAYS.get(today)

    if special == "skip":
        return None
    if special and special in SCHEDULES:
        return SCHEDULES[special]
    if dow >= 5:
        return None

    key = DAY_SCHEDULE.get(dow)
    return SCHEDULES.get(key)


# ── Plug control ──────────────────────────────────────────────────────────────
def set_plugs(on: bool, retries: int = 2):
    state = "on" if on else "off"
    label = state.upper()
    for ip in SHELLY_IPS:
        for attempt in range(1, retries + 2):
            try:
                r = requests.get(f"http://{ip}/relay/0?turn={state}", timeout=5)
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


# ── Main loop ─────────────────────────────────────────────────────────────────
def run():
    log.info("Bell alert scheduler started  plugs=%s", SHELLY_IPS)

    while True:
        now   = datetime.now()
        today = now.date()
        bells = get_today_bells()

        if bells is None:
            midnight = datetime(today.year, today.month, today.day) + timedelta(days=1)
            sleep_s  = (midnight - now).total_seconds() + 5
            reason   = "weekend" if today.weekday() >= 5 else "skip / no school"
            log.info("No bells today (%s) — sleeping until %s", reason, midnight.date())
            time.sleep(sleep_s)
            continue

        pending = [(dt, on) for dt, on in build_events(bells) if dt > now]

        if not pending:
            midnight = datetime(today.year, today.month, today.day) + timedelta(days=1)
            sleep_s  = (midnight - now).total_seconds() + 5
            log.info("All bells done for today — sleeping until %s", midnight.date())
            time.sleep(sleep_s)
            continue

        next_dt, next_on = pending[0]
        sleep_s = (next_dt - datetime.now()).total_seconds()

        if sleep_s > 0:
            log.info("Next event: %s %s  (in %.0f s)",
                     next_dt.strftime("%H:%M"), "ON" if next_on else "OFF", sleep_s)
            time.sleep(max(sleep_s - 1, 0))

        while datetime.now() < next_dt:
            time.sleep(0.1)

        set_plugs(next_on)


if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        log.info("Scheduler stopped by user.")
        set_plugs(False)
