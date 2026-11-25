#!/usr/bin/env python3
"""
override.py — Manual control for bell alert Shelly plugs.

Usage:
    python override.py on          # turn the plug(s) ON
    python override.py off         # turn the plug(s) OFF
    python override.py test        # ON for 10 seconds, then OFF
    python override.py status      # show current on/off state of each plug
    python override.py reset       # Wi-Fi radio off/on + hotspot restart (reset-hotspot.ps1)

Finds the plugs the same way the scheduler does: by MAC address (SHELLY_MAC_1 /
SHELLY_MAC_2 in .env) through the Windows ARP table. Actions are also written to
logs/bell_alert.log.
"""

import sys
import time
import requests

# Windows consoles default to cp1252, which can't print → or ✓. Set this before
# importing the scheduler, whose log handler writes to stdout.
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Reuses the scheduler's .env loading, MAC → IP lookup and Gen2+ RPC calls.
# Importing does not start the scheduler (run() only runs under __main__).
from bell_scheduler import resolve_ips, set_plugs, reset_hotspot, log


def find_plugs() -> list[str]:
    ips = resolve_ips()
    if not ips:
        print("No plug found. Is the hotspot on, and does the plug show up as a connected device?")
        print("Try:  python override.py reset")
    return ips


def cmd_status(ips: list[str]):
    print("Plug status:")
    for ip in ips:
        try:
            r = requests.get(f"http://{ip}/rpc/Switch.GetStatus?id=0", timeout=5)
            if r.ok:
                state = "ON" if r.json().get("output") else "OFF"
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

    if cmd == "reset":
        log.info("Manual hotspot reset (override.py)")
        reset_hotspot("manual (override.py)")
        return

    if cmd not in ("on", "off", "test", "status"):
        print(f"Unknown command: {cmd}")
        print(__doc__)
        sys.exit(1)

    ips = find_plugs()
    if not ips:
        sys.exit(1)

    if cmd == "status":
        cmd_status(ips)
        return

    log.info("Manual override: %s", cmd.upper())
    if cmd == "on":
        set_plugs(True, ips)
    elif cmd == "off":
        set_plugs(False, ips)
    elif cmd == "test":
        set_plugs(True, ips)
        time.sleep(10)
        set_plugs(False, ips)


if __name__ == "__main__":
    main()
