<#
.SYNOPSIS
    Registers the hotspot and bell-scheduler tasks for the current user.
.DESCRIPTION
    Creates two scheduled tasks (no admin needed):

      MobileHotspot-7AM  Runs start-hotspot.ps1 at log on and every 30 min
                         from 6:00 to 8:30 AM, Mon-Fri. The script's own
                         school-hours window and LAN guard decide whether
                         to actually start the hotspot.
      Bell Alert         Runs bell_scheduler.py (pythonw, no console) at log on
                         and keeps it running all day.

    Prerequisites: venv\ created and .env present (see README Step 3-4).
    The ARP-cleanup task needs admin; register it separately with
    register-arp-cleanup-task.ps1 from an elevated prompt.

    Safe to re-run: existing tasks with these names are replaced.
#>

$dir     = $PSScriptRoot
$user    = "$env:USERDOMAIN\$env:USERNAME"
$pythonw = Join-Path $dir "venv\Scripts\pythonw.exe"

if (-not (Test-Path $pythonw))             { Write-Error "venv not found -- run: python -m venv venv; venv\Scripts\pip install -r requirements.txt"; exit 1 }
if (-not (Test-Path (Join-Path $dir ".env"))) { Write-Error ".env not found -- copy .env.example to .env"; exit 1 }

$principal = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Limited

# ── Hotspot ───────────────────────────────────────────────────────────────────
$hotspotName = "MobileHotspot-7AM"
$days = 'Monday','Tuesday','Wednesday','Thursday','Friday'
$hotspotTriggers = @(New-ScheduledTaskTrigger -AtLogOn -User $user)
foreach ($t in '6:00AM','6:30AM','7:00AM','7:30AM','8:00AM','8:30AM') {
    $hotspotTriggers += New-ScheduledTaskTrigger -Weekly -DaysOfWeek $days -At $t
}
$hotspotAction = New-ScheduledTaskAction `
    -Execute  "powershell.exe" `
    -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dir\start-hotspot.ps1`""
$hotspotSettings = New-ScheduledTaskSettingsSet `
    -MultipleInstances IgnoreNew `
    -StartWhenAvailable `
    -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 15)

Unregister-ScheduledTask -TaskName $hotspotName -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName $hotspotName -Action $hotspotAction -Trigger $hotspotTriggers `
    -Settings $hotspotSettings -Principal $principal `
    -Description "Starts Windows Mobile Hotspot on school ethernet so the Shelly bell plug can connect." | Out-Null
Write-Host "Registered '$hotspotName'."

# ── Bell scheduler ────────────────────────────────────────────────────────────
$bellName = "Bell Alert"
$bellTrigger = New-ScheduledTaskTrigger -AtLogOn -User $user
$bellTrigger.Delay = "PT1M"   # give the hotspot a head start
$bellAction = New-ScheduledTaskAction -Execute $pythonw -Argument "bell_scheduler.py" -WorkingDirectory $dir
$bellSettings = New-ScheduledTaskSettingsSet `
    -MultipleInstances IgnoreNew `
    -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)

Unregister-ScheduledTask -TaskName $bellName -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName $bellName -Action $bellAction -Trigger $bellTrigger `
    -Settings $bellSettings -Principal $principal `
    -Description "Flashes the classroom bell light via the Shelly plug before each bell." | Out-Null
Write-Host "Registered '$bellName'."

Write-Host ""
Write-Host "Start now without logging off:  Start-ScheduledTask -TaskName '$bellName'"
Write-Host "Watch the log:                  Get-Content '$dir\logs\bell_alert.log' -Wait"
