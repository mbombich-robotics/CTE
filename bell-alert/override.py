#!/usr/bin/env python3
"""
override.py — Manual control for bell alert Shelly plugs.

Usage:
    python override.py on          # turn both plugs ON
    python override.py off         # turn both plugs OFF
    python override.py test        # ON for 10 seconds, then OFF
    python override.py status      # show current on/off state of each plug
"""

import os
import sys
import time
import requests
from dotenv import load_dotenv

load_dotenv()

SHELLY_IPS = [ip for ip in [os.getenv("SHELLY_IP_1"), os.getenv("SHELLY_IP_2")] if ip]

if not SHELLY_IPS:
    sys.exit("ERROR: No Shelly IPs found in .env — set SHELLY_IP_1 and SHELLY_IP_2.")


def set_plugs(on: bool):
    state = "on" if on else "off"
    for ip in SHELLY_IPS:
        try:
            r = requests.get(f"http://{ip}/relay/0?turn={state}", timeout=5)
            ok = "✓" if r.ok else f"✗ HTTP {r.status_code}"
            print(f"  {ip}  →  {state.upper()}  {ok}")
        except Exception as exc:
            print(f"  {ip}  →  {state.upper()}  ✗  {exc}")


def cmd_status():
    print("Plug status:")
    for ip in SHELLY_IPS:
        try:
            r = requests.get(f"http://{ip}/relay/0", timeout=5)
            if r.ok:
                data  = r.json()
                state = "ON" if data.get("ison") else "OFF"
                print(f"  {ip}  →  {state}")
            else:
                print(f"  {ip}  →  ✗ HTTP {r.status_code}")
        except Exception as exc:
            print(f"  {ip}  →  ✗  {exc}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1].lower()

    if cmd == "on":
        print("Turning plugs ON…")
        set_plugs(True)

    elif cmd == "off":
        print("Turning plugs OFF…")
        set_plugs(False)

    elif cmd == "test":
        print("Test: ON for 10 seconds…")
        set_plugs(True)
        time.sleep(10)
        print("Test: OFF")
        set_plugs(False)

    elif cmd == "status":
        cmd_status()

    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
