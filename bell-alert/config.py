"""
Bell schedule configuration — Room 70, VHS, 2026-27.

Each bell entry is a (on_time, off_time) tuple, both "HH:MM" 24-hour strings.
LEDs turn ON at on_time and OFF at off_time.

First period uses a 10-minute lead because 8th graders (MS schedule, bell at
8:32) need extra time to pack up and transit — all other periods use 2 minutes.
"""

from datetime import date

# ── Regular Schedules ─────────────────────────────────────────────────────────
# Comment out any period you don't need (e.g. your own prep).

# Monday / Wednesday / Friday  (7-Period Day, 50-min classes)
MWF_BELLS = [
    ("08:22", "08:32"),   # 1st  — 8AER   MS bell 8:32 · 10-min lead for 8th graders
    ("09:20", "09:22"),   # 2nd  — DBL
  # ("10:15", "10:17"),   # 3rd  — PREP   (your planning period — no students)
    ("11:09", "11:11"),   # 4th  — DBL
    ("12:09", "12:11"),   # 5th  — DBL
    ("12:39", "12:41"),   # Lunch end
    ("13:33", "13:35"),   # 6th  — HSAER
    ("14:27", "14:29"),   # 7th  — HSAER
]

# Tuesday / Thursday  (30-Min Tutorial Day, 43-min classes)
TTH_BELLS = [
    ("08:22", "08:32"),   # 1st  — 8AER   MS bell 8:32 · 10-min lead for 8th graders
    ("09:08", "09:10"),   # 2nd  — DBL
  # ("09:56", "09:58"),   # 3rd  — PREP   (your planning period — no students)
    ("10:44", "10:46"),   # 4th  — DBL
    ("11:19", "11:21"),   # Tutorial end
    ("12:19", "12:21"),   # 5th  — DBL
    ("12:49", "12:51"),   # Lunch end
    ("13:37", "13:39"),   # 6th  — HSAER
    ("14:27", "14:29"),   # 7th  — HSAER
]

# ── Special Schedules ─────────────────────────────────────────────────────────

# HS Half-Day / MS Half-Day
# HS bells: 8:02 · 8:31 · 9:00 · 9:29 · 9:58 · 10:27 · 10:56
# MS 8th-grade 1st hour ends 8:12 on half days → 10-min lead = ON at 8:02
HALF_DAY_BELLS = [
    ("08:02", "08:12"),   # 1st  — 8AER   MS half-day bell 8:12 · 10-min lead
    ("08:29", "08:31"),   # 2nd  — DBL
  # ("08:58", "09:00"),   # 3rd  — PREP
    ("09:27", "09:29"),   # 4th  — DBL
    ("09:56", "09:58"),   # 5th  — DBL
    ("10:25", "10:27"),   # 6th  — HSAER
    ("10:54", "10:56"),   # 7th  — HSAER
]

# Assembly Day  (VHS Assembly Schedule 2025-26, 3rd Lunch, 1:45 dismissal)
# HS 1st hour ends 8:20; MS assembly 1st hour ends 8:26 — DISCREPANCY.
# Currently using HS bell (8:20) as the dismiss time for 8AER.
# If 8th graders actually leave at 8:26, change ("08:10","08:20") → ("08:16","08:26").
ASSEMBLY_BELLS = [
    ("08:10", "08:20"),   # 1st  — 8AER   HS assembly bell 8:20 · 10-min lead
    ("09:04", "09:06"),   # 2nd  — DBL
  # ("09:52", "09:54"),   # 3rd  — PREP
    ("10:38", "10:40"),   # 4th  — DBL
    ("11:37", "11:39"),   # 5th  — DBL
    ("12:07", "12:09"),   # Lunch end
    ("12:54", "12:56"),   # 6th  — HSAER
    ("13:43", "13:45"),   # 7th  — HSAER  (1:45 dismissal)
]

# ── Special Day Overrides ─────────────────────────────────────────────────────
# Map specific dates → schedule key.
# Valid keys: "mwf", "tth", "half_day", "assembly", "skip" (no bells at all)
SPECIAL_DAYS: dict[date, str] = {
    # date(2026,  9,  7): "skip",        # Labor Day
    # date(2026, 11, 25): "skip",        # Thanksgiving break
    # date(2026, 10, 21): "half_day",    # example half-day
    # date(2026, 12,  9): "assembly",    # example assembly day
}

# ── Schedule registry & weekday defaults ──────────────────────────────────────
SCHEDULES = {
    "mwf":      MWF_BELLS,
    "tth":      TTH_BELLS,
    "half_day": HALF_DAY_BELLS,
    "assembly": ASSEMBLY_BELLS,
}

DAY_SCHEDULE = {
    0: "mwf",   # Monday
    1: "tth",   # Tuesday
    2: "mwf",   # Wednesday
    3: "tth",   # Thursday
    4: "mwf",   # Friday
    # 5, 6 = weekend → no bells (handled in scheduler)
}

# Log file path (relative to this file's directory)
LOG_FILE = "logs/bell_alert.log"
