# VCS Classroom Bell Alert

Turns two Tuya smart plugs ON 2 minutes before each bell and OFF at the bell.
Built for Gosund/GHome WP3 plugs wired to flashing LEDs.

---

## Prerequisites

- Python 3.10+
- A Tuya IoT Platform developer account at [iot.tuya.com](https://iot.tuya.com)
- Your Smart Life / Gosund app account linked to the IoT platform

---

## Step 1 — Tuya IoT Platform setup

### 1a. Create a Cloud project
1. Log in to [iot.tuya.com](https://iot.tuya.com)
2. **Cloud → Development → Create Cloud Project**
   - Industry: Smart Home
   - Data center: match your account region (Western America = `us`, etc.)
3. Under **API Products**, enable:
   - **IoT Core**
   - **Smart Home Scene Linkage** (optional but helpful)
4. Click **Authorize**

### 1b. Link your app account
1. In your project → **Devices → Link Tuya App Account**
2. Scan the QR code with the Smart Life or Gosund app
3. Your devices will appear in the device list

### 1c. Grab your credentials
From your project's **Overview** tab, copy:
- **Access ID / Client ID** → `TUYA_ACCESS_ID`
- **Access Secret / Client Secret** → `TUYA_ACCESS_SECRET`
- Note your **Data Center** region (`us`, `eu`, `cn`, or `in`) → `TUYA_REGION`

### 1d. Find your device IDs
Option A — Tuya IoT platform:
- Project → **Devices** → click a device → copy the **Device ID**

Option B — scan from this tool (after `.env` is set up):
```bash
python override.py scan
```

---

## Step 2 — Install on your device

```bash
# Clone or copy the project to your Pi / shop PC
cd ~
git clone <your-repo-url> bell-alert
cd bell-alert

# Create a virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Step 3 — Configure credentials

```bash
cp .env.example .env
nano .env        # fill in your Tuya credentials and device IDs
```

---

## Step 4 — Set your bell times

Edit **`config.py`** and fill in your actual bell times for both schedules:

```python
MWF_BELLS = ["08:00", "08:52", ...]   # Monday / Wednesday / Friday
TTH_BELLS = ["08:00", "09:20", ...]   # Tuesday / Thursday
```

Times are 24-hour `HH:MM` strings representing **when the bell rings**.
LEDs turn on `LEAD_MINUTES` before each entry and off at the bell time.

---

## Step 5 — Test it manually

```bash
source venv/bin/activate

# Verify your credentials and device IDs
python override.py scan

# Quick functional test — ON for 10 seconds, then OFF
python override.py test

# Force on / off
python override.py on
python override.py off
```

---

## Step 6 — Run as a background service (systemd)

Why systemd over cron?  
- Survives reboots automatically  
- Restarts itself if it crashes  
- Logs to `journalctl` for easy debugging  
- Handles "run continuously" cleanly (cron is designed for one-shot tasks)

```bash
# Edit the service file to match your username and path
nano bell-alert.service

# Install the service
sudo cp bell-alert.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable bell-alert    # auto-start on boot
sudo systemctl start bell-alert     # start now
```

### Check status / logs

```bash
sudo systemctl status bell-alert
journalctl -u bell-alert -f          # live log tail
cat logs/bell_alert.log              # file log
```

---

## Adding holidays / no-school days

Open `bell_scheduler.py` and find the `is_skip_day()` function:

```python
def is_skip_day(today: date) -> bool:
    # Add your holiday logic here
    NO_SCHOOL = {date(2026, 9, 7), date(2026, 11, 26)}
    return today in NO_SCHOOL
```

Uncomment the example and add your dates. Restart the service after editing:

```bash
sudo systemctl restart bell-alert
```

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| `Missing credentials` on startup | `.env` file missing or has blank values |
| Plugs not responding | Run `python override.py scan` — are devices online? |
| Wrong region | IoT platform → project → data center; set `TUYA_REGION` to match |
| Command code error | Some WP3 units use `switch` instead of `switch_1` — check device logs in Tuya IoT platform |
| Service won't start | `journalctl -u bell-alert -n 50` for the full error |
