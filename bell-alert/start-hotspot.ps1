# start-hotspot.ps1 — Start Windows Mobile Hotspot
# Called by Task Scheduler (7 AM weekdays + every 30 min until 10 AM).
# Polls until an ETHERNET internet connection appears, then starts the hotspot.
# Gives up after $maxWait seconds so it doesn't run forever.

$logFile    = "$PSScriptRoot\logs\hotspot-start.log"
$maxWait    = 600   # seconds — stop trying after 10 min
$pollEvery  = 20    # seconds between checks

function Write-Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg"
    try { Add-Content -Path $logFile -Value $line -ErrorAction SilentlyContinue } catch {}
}

# Ensure log directory exists
try { New-Item -ItemType Directory -Force -Path (Split-Path $logFile) | Out-Null } catch {}

Write-Log "--- run start ---"

# Load WinRT types
try {
    $null = [Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]
    $null = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,Windows.Networking.NetworkOperators,ContentType=WindowsRuntime]
} catch {
    Write-Log "FATAL: could not load WinRT types — $_"
    exit 1
}

$waited = 0
while ($waited -lt $maxWait) {
    try {
        $connProfile = [Windows.Networking.Connectivity.NetworkInformation]::GetInternetConnectionProfile()

        if ($connProfile -and $connProfile.NetworkAdapter) {
            $ifType = $connProfile.NetworkAdapter.IanaInterfaceType
            # 6 = Ethernet; 71 = Wi-Fi.  Only start hotspot when ethernet is the uplink.
            if ($ifType -eq 6) {
                $mgr = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager]::CreateFromConnectionProfile($connProfile)
                if ($mgr.TetheringOperationalState -eq 'On') {
                    Write-Log "Hotspot already on — done."
                    exit 0
                }
                Write-Log "Ethernet detected (IFType=$ifType). Starting hotspot..."
                $mgr.StartTetheringAsync() | Out-Null
                Start-Sleep -Seconds 8
                $state = $mgr.TetheringOperationalState
                Write-Log "Hotspot state after start: $state"
                exit 0
            } else {
                Write-Log "Internet profile is not ethernet (IFType=$ifType) — waiting..."
            }
        } else {
            Write-Log "No internet profile yet — waiting..."
        }
    } catch {
        Write-Log "Error: $_"
    }

    Start-Sleep -Seconds $pollEvery
    $waited += $pollEvery
}

Write-Log "TIMEOUT — ethernet did not appear in ${maxWait}s. Will retry on next task trigger."
