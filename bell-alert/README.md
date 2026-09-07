# VCS Classroom Bell Alert

Turns a Shelly smart plug ON before each bell and OFF at the bell.
No cloud account required — controls the plug directly over your local network.

---

## Hardware

- Shelly Plug S or Shelly Plus Plug US (Gen 1 or Gen 2 both work)
- The plug drives a flashing LED wired to the outlet

---

## Step 1 — Connect the Shelly to your network

1. Plug in the Shelly. It broadcasts its own hotspot (`ShellyPlug-xxxx` or `ShellyPlusPlugUS-xxxx`).
2. Connect a laptop to that hotspot, then open `192.168.33.1` in a browser.
3. Go to **Settings → WiFi** and add your network (school WiFi or personal hotspot SSID + password).
4. The Shelly reboots and joins your network.

---

## Step 2 — Give it a fixed IP

The scheduler calls the plug by IP address, so the IP must not change.

**Recommended — DHCP reservation on your router:**
1. Shelly web UI → **Settings → Device Info** → copy the **MAC address**
2. Router admin page → find the Shelly in the connected-devices list → reserve that MAC → fixed IP
3. No need to change anything on the Shelly itself

**Alternative — static IP on the Shelly itself** (use this if you can't access the router, e.g. on a phone hotspot):
- Shelly web UI → **Settings → WiFi → IPv4 Configuration → Static**
- Set IP, subnet mask (`255.255.255.0`), and gateway (your router/hotspot IP)

---

## Step 3 — Install Python dependencies

```powershell
cd bell-alert
python -m venv venv
venv\Scripts\activate
pip install requests python-dotenv
```

---

## Step 4 — Set the IP in `.env`

Edit `.env` and replace the placeholder with the IP you assigned:

```
SHELLY_IP_1=192.168.1.150
```

---

## Step 5 — Set your bell times

Edit **`config.py`**. Each entry is a `(on_time, off_time)` tuple in 24-hour `HH:MM` format.
The LED turns ON at `on_time` and OFF at `off_time`.

---

## Step 6 — Test it

```powershell
venv\Scripts\activate

# Check the plug is reachable and see its current state
python override.py status

# Quick functional test — ON for 10 seconds, then OFF
python override.py test

# Force on / off
python override.py on
python override.py off
```

---

## Step 7 — Run as a background service (Windows Task Scheduler)

Task Scheduler starts the script automatically when you log in.

Open **Task Scheduler** → **Create Task** (not "Create Basic Task"):

| Tab | Setting |
|-----|---------|
| **General** | Name: `Bell Alert` · *Run only when user is logged on* · *Run with highest privileges* |
| **Triggers** | New → **At log on** → your user account |
| **Actions** | New → **Start a program** |
| **Settings** | *If the task is already running, do not start a new instance* |

Action settings:
- **Program/script:** `C:\path\to\bell-alert\venv\Scripts\pythonw.exe`
  *(use `pythonw.exe` — hides the console window)*
- **Add arguments:** `bell_scheduler.py`
- **Start in:** `C:\path\to\bell-alert`

Log off and back on — the scheduler starts automatically.

### Check the log

```powershell
Get-Content C:\path\to\bell-alert\logs\bell_alert.log -Wait
```

To stop: Task Scheduler → Bell Alert → **End**.  
To restart after a config change: **End**, then **Run**.

---

## Adding holidays / no-school days

In **`config.py`**, add dates to `SPECIAL_DAYS`:

```python
SPECIAL_DAYS: dict[date, str] = {
    date(2026,  9,  7): "skip",    # Labor Day
    date(2026, 11, 25): "skip",    # Thanksgiving
    date(2026, 10, 21): "half_day",
}
```

Valid values: `"mwf"`, `"tth"`, `"half_day"`, `"assembly"`, `"skip"`.

Restart the scheduler after editing: Task Scheduler → End → Run.

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| `No Shelly IPs found` on startup | `.env` file missing or `SHELLY_IP_1` is still the placeholder |
| `Connection refused` or timeout | Wrong IP, or Shelly is offline — run `python override.py status` |
| Plug responds to `override.py` but not at bell time | Check the log; verify bell times in `config.py` are 24-hour format |
| Gen 2 plug returns HTTP error | Gen 2 uses a different API — see note below |

**Gen 2 note:** Shelly Plus models use an RPC API. If `python override.py status` fails with a non-200 response, the plug is Gen 2. Change the URL in `bell_scheduler.py` and `override.py` from:
```
http://{ip}/relay/0?turn={state}
```
to:
```
http://{ip}/rpc/Switch.Set?id=0&on={"true" if on else "false"}
```
