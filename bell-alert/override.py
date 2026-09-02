#!/usr/bin/env python3
"""
override.py — Manual control for bell alert plugs.

Usage:
    python override.py on          # turn both plugs ON
    python override.py off         # turn both plugs OFF
    python override.py test        # ON for 10 seconds, then OFF
    python override.py scan        # list all Tuya devices on your account
                                   # (use this to find your device IDs)
"""

import os
import sys
import time

from dotenv import load_dotenv
import tinytuya

load_dotenv()

ACCESS_ID     = os.getenv("TUYA_ACCESS_ID")
ACCESS_SECRET = os.getenv("TUYA_ACCESS_SECRET")
REGION        = os.getenv("TUYA_REGION", "us")
DEVICE_IDS    = [os.getenv("DEVICE_ID_1"), os.getenv("DEVICE_ID_2")]


def cloud():
    return tinytuya.Cloud(
        apiRegion=REGION,
        apiKey=ACCESS_ID,
        apiSecret=ACCESS_SECRET,
    )


def set_plugs(c, on: bool):
    state = "ON" if on else "OFF"
    for device_id in DEVICE_IDS:
        if not device_id:
            print(f"  [skip] device ID not set")
            continue
        result = c.sendcommand(device_id, {"commands": [{"code": "switch_1", "value": on}]})
        ok = result and result.get("success")
        print(f"  {device_id}  →  {state}  {'✓' if ok else '✗  ' + str(result)}")


def cmd_scan(c):
    print("Fetching device list from Tuya Cloud…\n")
    devices = c.getdevices()
    if not devices:
        print("No devices found. Check your credentials and region.")
        return
    print(f"{'Name':<30} {'Device ID':<24} {'Online'}")
    print("-" * 65)
    for d in devices:
        name   = d.get("name", "—")[:28]
        dev_id = d.get("id", "—")
        online = "✓" if d.get("online") else "✗"
        print(f"{name:<30} {dev_id:<24} {online}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1].lower()
    c   = cloud()

    if cmd == "on":
        print("Turning plugs ON…")
        set_plugs(c, True)

    elif cmd == "off":
        print("Turning plugs OFF…")
        set_plugs(c, False)

    elif cmd == "test":
        print("Test: ON for 10 seconds…")
        set_plugs(c, True)
        time.sleep(10)
        print("Test: OFF")
        set_plugs(c, False)

    elif cmd == "scan":
        cmd_scan(c)

    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
