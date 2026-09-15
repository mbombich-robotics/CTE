#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Registers a Windows scheduled task that clears stale Shelly ARP entries at startup.
.DESCRIPTION
    Creates a task named "ShellyARPClean" that runs clear-stale-arp.ps1 as SYSTEM
    at every Windows startup.  Running as SYSTEM means it always has permission to
    delete ARP entries and never shows a UAC prompt.

    Run this script ONCE from an elevated (Administrator) PowerShell prompt.
    After that, the cleanup happens automatically on every boot.
#>

$taskName   = "ShellyARPClean"
$scriptPath = Join-Path $PSScriptRoot "clear-stale-arp.ps1"

if (-not (Test-Path $scriptPath)) {
    Write-Error "clear-stale-arp.ps1 not found at: $scriptPath"
    exit 1
}

# Remove any existing version of the task
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$action  = New-ScheduledTaskAction `
    -Execute    "powershell.exe" `
    -Argument   "-NonInteractive -ExecutionPolicy Bypass -File `"$scriptPath`""

# Trigger: at system startup, with a short delay so network is up
$trigger = New-ScheduledTaskTrigger -AtStartup

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
    -StartWhenAvailable `
    -DontStopIfGoingOnBatteries `
    -RunOnlyIfNetworkAvailable:$false   # network check handled inside the script

$principal = New-ScheduledTaskPrincipal `
    -UserId    "SYSTEM" `
    -LogonType ServiceAccount `
    -RunLevel  Highest

Register-ScheduledTask `
    -TaskName  $taskName `
    -Action    $action `
    -Trigger   $trigger `
    -Settings  $settings `
    -Principal $principal `
    -Description "Removes stale ARP entries for Shelly smart plugs before the bell scheduler starts." `
    | Out-Null

Write-Host ""
Write-Host "Task '$taskName' registered successfully."
Write-Host "It will run at every Windows startup (as SYSTEM, no UAC prompt)."
Write-Host ""
Write-Host "To run the cleanup RIGHT NOW without rebooting:"
Write-Host "  Start-ScheduledTask -TaskName '$taskName'"
Write-Host ""
Write-Host "To remove the task later:"
Write-Host "  Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false"
