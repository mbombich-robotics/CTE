# start-hotspot.ps1 — Start Windows Mobile Hotspot at logon
# Scheduled via Task Scheduler; runs 60s after login to give ethernet time to establish.

try {
    $null = [Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]
    $null = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,Windows.Networking.NetworkOperators,ContentType=WindowsRuntime]

    $connProfile = [Windows.Networking.Connectivity.NetworkInformation]::GetInternetConnectionProfile()
    $manager = [Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager]::CreateFromConnectionProfile($connProfile)

    if ($manager.TetheringOperationalState -ne 'On') {
        $manager.StartTetheringAsync() | Out-Null
        Start-Sleep -Seconds 5
    }
} catch {
    $_ | Out-File "$PSScriptRoot\logs\hotspot-start.log" -Append
}
