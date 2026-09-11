# start-hotspot.ps1 -- Start Windows Mobile Hotspot
# Called by Task Scheduler (weekdays). Run with powershell.exe (5.1), NOT pwsh.exe.
# WinRT tethering API requires Windows PowerShell 5.1 for type loading.
# Polls until an ETHERNET internet connection appears, then starts the hotspot.
# Gives up after $maxWait seconds so it does not run forever.

$logFile   = "$PSScriptRoot\logs\hotspot-start.log"
$maxWait   = 600   # seconds -- stop trying after 10 min
$pollEvery = 20    # seconds between checks

function Write-Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg"
    try { Add-Content -Path $logFile -Value $line -Encoding UTF8 -ErrorAction SilentlyContinue } catch {}
}

# Ensure log directory exists
try { New-Item -ItemType Directory -Force -Path (Split-Path $logFile) | Out-Null } catch {}

Write-Log "--- run start ---"

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
