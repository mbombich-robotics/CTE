"""
Bell schedule configuration.
All times are 24-hour "HH:MM" strings representing when the BELL RINGS.
LEDs turn ON `LEAD_MINUTES` before each bell and OFF at the bell time.
"""

# How many minutes before the bell to turn LEDs on
LEAD_MINUTES = 2

# ── FILL IN YOUR BELL TIMES ──────────────────────────────────────────────────
# Monday / Wednesday / Friday schedule
MWF_BELLS = [
    "07:58",   # example — replace with your actual times
    "08:50",
    "09:42",
    "10:34",
    "11:26",
    "12:18",
    "13:10",
    "14:02",
]

# Tuesday / Thursday schedule
TTH_BELLS = [
    "07:58",   # example — replace with your actual times
    "09:20",
    "10:42",
    "12:04",
    "13:26",
    "14:48",
]
# ─────────────────────────────────────────────────────────────────────────────

# Maps Python weekday() → schedule key  (0=Mon … 4=Fri; 5,6=weekend)
DAY_SCHEDULE = {
    0: MWF_BELLS,   # Monday
    1: TTH_BELLS,   # Tuesday
    2: MWF_BELLS,   # Wednesday
    3: TTH_BELLS,   # Thursday
    4: MWF_BELLS,   # Friday
    # 5, 6: Saturday/Sunday → no bells (handled in scheduler)
}

# Log file path (relative to this file's directory)
LOG_FILE = "logs/bell_alert.log"
