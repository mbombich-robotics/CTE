#!/usr/bin/env python3
"""
bell_scheduler.py — VCS Classroom Bell Alert
Turns two Tuya smart plugs ON 2 minutes before each bell, OFF at the bell.
Runs continuously; designed to be managed by systemd.
"""

import os
import sys
import time
import logging
from datetime import datetime, timedelta, date

from dotenv import load_dotenv
import tinytuya

from config import LEAD_MINUTES, DAY_SCHEDULE, LOG_FILE

# ── Load credentials ──────────────────────────────────────────────────────────
load_dotenv()

ACCESS_ID     = os.getenv("TUYA_ACCESS_ID")
ACCESS_SECRET = os.getenv("TUYA_ACCESS_SECRET")
REGION        = os.getenv("TUYA_REGION", "us")
DEVICE_IDS    = [
    os.getenv("DEVICE_ID_1"),
    os.getenv("DEVICE_ID_2"),
]

if not all([ACCESS_ID, ACCESS_SECRET] + DEVICE_IDS):
    sys.exit("ERROR: Missing credentials in .env — check .env.example for required keys.")

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

# ── Tuya cloud client ─────────────────────────────────────────────────────────
def make_cloud():
    return tinytuya.Cloud(
        apiRegion=REGION,
        apiKey=ACCESS_ID,
        apiSecret=ACCESS_SECRET,
    )

cloud = make_cloud()


# ── Holiday / skip-day hook ───────────────────────────────────────────────────
def is_skip_day(today: date) -> bool:
    """
    Return True to skip all bells for `today`.
    Plug in holiday logic here — e.g. load a list of dates from a file,
    check a Google Calendar, etc.  Currently always returns False.
    """
    # EXAMPLE (uncomment and extend as needed):
    # NO_SCHOOL = {date(2026, 9, 7), date(2026, 11, 26)}
    # return today in NO_SCHOOL
    return False


# ── Plug control ──────────────────────────────────────────────────────────────
def set_plugs(on: bool, retries: int = 2):
    state = "ON" if on else "OFF"
    for device_id in DEVICE_IDS:
        for attempt in range(1, retries + 2):
            try:
                result = cloud.sendcommand(
                    device_id,
                    {"commands": [{"code": "switch_1", "value": on}]},
                )
                if result and result.get("success"):
                    log.info("Plug %-24s → %s", device_id, state)
                else:
                    log.warning("Plug %s → %s  (unexpected result: %s)", device_id, state, result)
                break
            except Exception as exc:
                if attempt <= retries:
                    log.warning("Plug %s attempt %d failed: %s — retrying…", device_id, attempt, exc)
                    time.sleep(2)
                else:
                    log.error("Plug %s FAILED after %d attempts: %s", device_id, retries + 1, exc)


# ── Schedule builder ──────────────────────────────────────────────────────────
def build_events(bells: list[str], lead: int) -> list[tuple[datetime, bool]]:
    """
    Given bell times like ['08:00', '08:52', ...] and lead minutes,
    return a sorted list of (datetime, is_on) events for today.
    """
    today = date.today()
    events = []
    for bell_str in bells:
        hh, mm = map(int, bell_str.split(":"))
        bell_dt = datetime(today.year, today.month, today.day, hh, mm)
        on_dt   = bell_dt - timedelta(minutes=lead)
        events.append((on_dt,  True))   # LEDs on
        events.append((bell_dt, False))  # LEDs off
    events.sort(key=lambda e: e[0])
    return events


# ── Main loop ─────────────────────────────────────────────────────────────────
def run():
    log.info("Bell alert scheduler started (region=%s, lead=%d min)", REGION, LEAD_MINUTES)

    while True:
        now   = datetime.now()
        today = now.date()
        dow   = today.weekday()  # 0=Mon … 6=Sun

        # Weekend or skip day — sleep until midnight and recheck
        if dow >= 5 or is_skip_day(today):
            reason = "weekend" if dow >= 5 else "skip day"
            midnight = datetime(today.year, today.month, today.day) + timedelta(days=1)
            sleep_s  = (midnight - now).total_seconds() + 5
            log.info("No bells today (%s) — sleeping until %s", reason, midnight.date())
            time.sleep(sleep_s)
            continue

        bells  = DAY_SCHEDULE[dow]
        events = build_events(bells, LEAD_MINUTES)

        # Filter to future events only
        pending = [(dt, on) for dt, on in events if dt > now]

        if not pending:
            # All bells done for today — sleep until midnight
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
            time.sleep(max(sleep_s - 1, 0))  # wake up 1 s early, then spin

        # Spin-wait the last second for accuracy
        while datetime.now() < next_dt:
            time.sleep(0.1)

        set_plugs(next_on)


if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        log.info("Scheduler stopped by user.")
        set_plugs(False)  # safety: make sure plugs are off on exit
