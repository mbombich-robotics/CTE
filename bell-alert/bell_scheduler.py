#!/usr/bin/env python3
"""
bell_scheduler.py — VCS Classroom Bell Alert
Turns two Tuya smart plugs ON before each bell, OFF at the bell.
Runs continuously; designed to be managed by Windows Task Scheduler.
"""

import os
import sys
import time
import logging
from datetime import datetime, timedelta, date

from dotenv import load_dotenv
import tinytuya

from config import DAY_SCHEDULE, SCHEDULES, SPECIAL_DAYS, LOG_FILE

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


# ── Schedule resolver ─────────────────────────────────────────────────────────
def get_today_bells() -> list[tuple[str, str]] | None:
    """
    Return the (on_time, off_time) bell list for today, or None if no school.

    Priority:
      1. SPECIAL_DAYS override (half_day / assembly / skip / force a specific key)
      2. Weekend → None
      3. Default weekday key from DAY_SCHEDULE
    """
    today = date.today()
    dow   = today.weekday()  # 0=Mon … 6=Sun

    special = SPECIAL_DAYS.get(today)

    if special == "skip":
        return None                            # no school / holiday

    if special and special in SCHEDULES:
        return SCHEDULES[special]              # half_day, assembly, etc.

    if dow >= 5:
        return None                            # Saturday / Sunday

    key = DAY_SCHEDULE.get(dow)
    return SCHEDULES.get(key)


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
def build_events(bells: list[tuple[str, str]]) -> list[tuple[datetime, bool]]:
    """
    Given bell pairs like [("08:22", "08:32"), ("09:20", "09:22"), ...],
    return a sorted list of (datetime, is_on) events for today.
    """
    today = date.today()
    events = []
    for on_str, off_str in bells:
        on_h,  on_m  = map(int, on_str.split(":"))
        off_h, off_m = map(int, off_str.split(":"))
        on_dt  = datetime(today.year, today.month, today.day, on_h,  on_m)
        off_dt = datetime(today.year, today.month, today.day, off_h, off_m)
        events.append((on_dt,  True))    # LEDs on
        events.append((off_dt, False))   # LEDs off
    events.sort(key=lambda e: e[0])
    return events


# ── Main loop ─────────────────────────────────────────────────────────────────
def run():
    log.info("Bell alert scheduler started (region=%s)", REGION)

    while True:
        now   = datetime.now()
        today = now.date()

        bells = get_today_bells()

        if bells is None:
            # No school today — sleep until midnight and recheck
            midnight = datetime(today.year, today.month, today.day) + timedelta(days=1)
            sleep_s  = (midnight - now).total_seconds() + 5
            reason   = "weekend" if today.weekday() >= 5 else "skip / no school"
            log.info("No bells today (%s) — sleeping until %s", reason, midnight.date())
            time.sleep(sleep_s)
            continue

        events  = build_events(bells)
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
        set_plugs(False)   # safety: make sure plugs are off on exit
