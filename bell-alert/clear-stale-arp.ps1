#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Removes stale ARP entries for Shelly smart plugs.
.DESCRIPTION
    When a Shelly reconnects to the hotspot with a new IP (or has a static IP
    that differs from a previous DHCP lease), Windows keeps the old entry as a
    permanent static entry in the ARP table.  This script reads the Shelly MAC
    addresses from .env, finds all ARP entries for each MAC, probes them to
    identify the live device, and deletes the stale ones.

    Run once manually to clean up immediately, or let the scheduled task
    (registered by register-arp-cleanup-task.ps1) handle it at every startup.
#>

$ErrorActionPreference = 'SilentlyContinue'

# ── Locate .env ───────────────────────────────────────────────────────────────
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$envFile   = Join-Path $scriptDir ".env"

if (-not (Test-Path $envFile)) {
    Write-Warning ".env not found at $envFile — nothing to do."
    exit 0
}

# ── Read MACs from .env ───────────────────────────────────────────────────────
$macs = @()
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*SHELLY_MAC_\d+\s*=\s*(.+)') {
        $macs += $Matches[1].Trim()
    }
}

if ($macs.Count -eq 0) {
    Write-Host "No SHELLY_MAC_N entries found in .env — nothing to clean."
    exit 0
}

# ── Wait for network if running at startup ────────────────────────────────────
# Give the hotspot and Shelly time to come up before probing.
$waitSec = 45
Write-Host "$(Get-Date -f 'HH:mm:ss')  Waiting ${waitSec}s for network…"
Start-Sleep -Seconds $waitSec

# ── Process each MAC ──────────────────────────────────────────────────────────
$arpLines = (arp -a)

foreach ($mac in $macs) {
    $normalized = $mac.ToLower() -replace ':', '-'
    Write-Host ""
    Write-Host "MAC: $mac"

    # Collect all ARP entries for this MAC
    $candidates = @()
    foreach ($line in $arpLines) {
        if ($line -match $normalized) {
            if ($line -match '(\d+\.\d+\.\d+\.\d+)') {
                $ip = $Matches[1]
                if ($candidates -notcontains $ip) { $candidates += $ip }
            }
        }
    }

    if ($candidates.Count -eq 0) {
        Write-Warning "  MAC not found in ARP table — plug may not be connected yet."
        continue
    }

    Write-Host "  ARP candidates: $($candidates -join ', ')"

    if ($candidates.Count -eq 1) {
        Write-Host "  Only one entry — nothing to clean."
        continue
    }

    # Probe each candidate to find the live Shelly
    $liveIp = $null
    foreach ($ip in $candidates) {
        try {
            $r = Invoke-WebRequest `
                -Uri "http://$ip/rpc/Shelly.GetStatus" `
                -TimeoutSec 3 `
                -UseBasicParsing `
                -ErrorAction Stop
            if ($r.StatusCode -eq 200) {
                $liveIp = $ip
                Write-Host "  Live device at $ip"
                break
            }
        } catch {}
    }

    if (-not $liveIp) {
        Write-Warning "  No candidate responded — leaving ARP table unchanged."
        continue
    }

    # Delete every entry that isn't the live IP
    foreach ($ip in $candidates) {
        if ($ip -ne $liveIp) {
            $result = arp -d $ip 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  Deleted stale entry: $ip"
            } else {
                Write-Warning "  Could not delete $ip — $result"
            }
        }
    }
}

Write-Host ""
Write-Host "$(Get-Date -f 'HH:mm:ss')  ARP cleanup done."
