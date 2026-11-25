# reset-hotspot.ps1 -- Recover a hotspot that says "On" but is not broadcasting
# Called by bell_scheduler.py when the Shelly stops answering. Run with powershell.exe (5.1).
#
# Seen on the Intel AX211: Windows reports the hotspot On with 0 clients, and no
# device (not even a phone) can see the SSID. Restarting the hotspot alone does
# not fix it; turning the Wi-Fi radio off and on, then restarting the hotspot, does.
#
# Guards (exit without touching anything):
#   1. SCHOOL LAN -- the school gateway must answer, so this never drops Wi-Fi at home.
#   2. ETHERNET   -- the internet uplink must be ethernet (needed to share it as a hotspot).

$logFile       = "$PSScriptRoot\logs\hotspot-start.log"
$schoolGateway = "10.40.254.1"   # keep in sync with start-hotspot.ps1

function Write-Log($msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  [reset] $msg"
    try { Add-Content -Path $logFile -Value $line -Encoding UTF8 -ErrorAction SilentlyContinue } catch {}
    Write-Output $line
}

if (-not (Test-Connection -ComputerName $schoolGateway -Count 1 -Quiet -ErrorAction SilentlyContinue)) {
    Write-Log "School gateway unreachable -- not on school LAN, skipping."
    exit 2
}

try {
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    $null = [Windows.Devices.Radios.Radio,Windows.System.Devices,ContentType=WindowsRuntime]
    $null = [Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]
    $null = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,Windows.Networking.NetworkOperators,ContentType=WindowsRuntime]
} catch {
    Write-Log "FATAL: could not load WinRT types -- $_"
    exit 1
}

$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, [Type]$type) {
    $task = $asTask.MakeGenericMethod($type).Invoke($null, @($op))
    $task.Wait(-1) | Out-Null
    $task.Result
}

function Get-Tether {
    $p = [Windows.Networking.Connectivity.NetworkInformation]::GetInternetConnectionProfile()
    if (-not $p -or -not $p.NetworkAdapter -or $p.NetworkAdapter.IanaInterfaceType -ne 6) { return $null }
    [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager]::CreateFromConnectionProfile($p)
}

$TR = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringOperationResult]
$RA = [Windows.Devices.Radios.RadioAccessStatus]

try {
    $mgr = Get-Tether
    if (-not $mgr) { Write-Log "Uplink is not ethernet -- skipping."; exit 2 }

    Write-Log "Stopping hotspot: $((Await ($mgr.StopTetheringAsync()) $TR).Status)"

    $null = Await ([Windows.Devices.Radios.Radio]::RequestAccessAsync()) $RA
    $radios = Await ([Windows.Devices.Radios.Radio]::GetRadiosAsync()) ([System.Collections.Generic.IReadOnlyList[Windows.Devices.Radios.Radio]])
    $wifi = $radios | Where-Object { $_.Kind -eq 'WiFi' } | Select-Object -First 1
    if ($wifi) {
        Write-Log "Wi-Fi radio off: $(Await ($wifi.SetStateAsync('Off')) $RA)"
        Start-Sleep -Seconds 5
        Write-Log "Wi-Fi radio on: $(Await ($wifi.SetStateAsync('On')) $RA)"
        Start-Sleep -Seconds 10
    } else {
        Write-Log "No Wi-Fi radio found -- restarting hotspot only."
    }

    $mgr = Get-Tether
    if (-not $mgr) { Write-Log "Ethernet uplink gone after radio reset -- cannot start hotspot."; exit 1 }
    Write-Log "Starting hotspot: $((Await ($mgr.StartTetheringAsync()) $TR).Status) (state $($mgr.TetheringOperationalState))"
    exit 0
} catch {
    Write-Log "Error: $_"
    exit 1
}
