# start-hotspot.ps1 -- Start Windows Mobile Hotspot
# Called by Task Scheduler (weekdays). Run with powershell.exe (5.1), NOT pwsh.exe.
# WinRT tethering API requires Windows PowerShell 5.1 for type loading.
# Polls until an ETHERNET internet connection appears, then starts the hotspot.
# Gives up after $maxWait seconds so it does not run forever.
#
# Guards (exit silently if either fails):
#   1. SCHOOL HOURS — only runs between $schoolHoursStart and $schoolHoursEnd.
#      Prevents "StartWhenAvailable" from firing missed tasks at off hours.
#   2. SCHOOL LAN   — pings $schoolGateway to confirm we're on the school network.
#      Set $schoolGateway to the IP of the school's ethernet gateway (ask IT if
#      unsure — it's the default gateway shown by `ipconfig` when plugged into LAN).

$logFile        = "$PSScriptRoot\logs\hotspot-start.log"
$maxWait        = 600   # seconds -- stop trying after 10 min
$pollEvery      = 20    # seconds between checks

# ── School-hours window (24-hour HH:MM) ──────────────────────────────────────
$schoolHoursStart = "05:45"
$schoolHoursEnd   = "09:00"

# ── School LAN gateway ────────────────────────────────────────────────────────
# Set this to the school's ethernet gateway IP (e.g. "10.1.0.1").
# Leave empty ("") to skip the LAN check and rely on the time window only.
$schoolGateway = ""   # <-- fill this in

function Write-Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg"
    try { Add-Content -Path $logFile -Value $line -Encoding UTF8 -ErrorAction SilentlyContinue } catch {}
}

# Ensure log directory exists
try { New-Item -ItemType Directory -Force -Path (Split-Path $logFile) | Out-Null } catch {}

# ── Guard 1: school hours ─────────────────────────────────────────────────────
$now      = Get-Date
$todayStr = $now.ToString("yyyy-MM-dd")
$winStart = [datetime]::ParseExact("$todayStr $schoolHoursStart", "yyyy-MM-dd HH:mm", $null)
$winEnd   = [datetime]::ParseExact("$todayStr $schoolHoursEnd",   "yyyy-MM-dd HH:mm", $null)

if ($now -lt $winStart -or $now -gt $winEnd) {
    # Silent exit — no log entry so the log stays clean
    exit 0
}

Write-Log "--- run start ---"

# ── Guard 2: school LAN ───────────────────────────────────────────────────────
if ($schoolGateway -ne "") {
    $ping = Test-Connection -ComputerName $schoolGateway -Count 1 -Quiet -ErrorAction SilentlyContinue
    if (-not $ping) {
        Write-Log "School gateway ($schoolGateway) unreachable -- not on school LAN, skipping."
        exit 0
    }
    Write-Log "School gateway reachable -- proceeding."
}

# Load WinRT types (requires powershell.exe 5.1 -- fails in pwsh.exe 7)
try {
    $null = [Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]
    $null = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,Windows.Networking.NetworkOperators,ContentType=WindowsRuntime]
} catch {
    Write-Log "FATAL: could not load WinRT types -- $_"
    exit 1
}

$waited = 0
while ($waited -lt $maxWait) {
    try {
        $connProfile = [Windows.Networking.Connectivity.NetworkInformation]::GetInternetConnectionProfile()

        if ($connProfile -and $connProfile.NetworkAdapter) {
            $ifType = $connProfile.NetworkAdapter.IanaInterfaceType
            # IanaInterfaceType: 6 = Ethernet, 71 = Wi-Fi
            # Only start hotspot when ethernet is the uplink.
            if ($ifType -eq 6) {
                $mgr = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager]::CreateFromConnectionProfile($connProfile)
                # TetheringOperationalState enum: 0=Unknown, 1=On, 2=Off, 3=InTransition
                if ($mgr.TetheringOperationalState -eq 1) {
                    Write-Log "Hotspot already on -- done."
                    exit 0
                }
                Write-Log "Ethernet detected (IFType=$ifType). Starting hotspot..."
                $mgr.StartTetheringAsync() | Out-Null
                Start-Sleep -Seconds 15
                $state = $mgr.TetheringOperationalState
                Write-Log "Hotspot state after start: $state"
                exit 0
            } else {
                Write-Log "Internet profile is not ethernet (IFType=$ifType) -- waiting..."
            }
        } else {
            Write-Log "No internet profile yet -- waiting..."
        }
    } catch {
        Write-Log "Error: $_"
    }

    Start-Sleep -Seconds $pollEvery
    $waited += $pollEvery
}

Write-Log "TIMEOUT -- ethernet did not appear in ${maxWait}s. Will retry on next task trigger."
