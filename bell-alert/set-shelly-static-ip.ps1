# set-shelly-static-ip.ps1
# Run this ONCE after the hotspot is on and the Shelly has connected.
# Sets a permanent static IP on the Shelly so DHCP reassignment can never move it.

$shellyIp = '192.168.137.126'  # current IP (from hotspot device list)

Write-Host "Checking Shelly at $shellyIp ..." -ForegroundColor Cyan

# 1. Verify it's reachable
try {
    $info = Invoke-RestMethod -Uri "http://$shellyIp/rpc/Shelly.GetDeviceInfo" -TimeoutSec 5
    Write-Host "  Found: $($info.app) ($($info.id))" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: can't reach $shellyIp — is the hotspot on and Shelly connected?" -ForegroundColor Red
    exit 1
}

# 2. Set static IP
$body = @{
    config = @{
        sta = @{
            dhcp       = $false
            ip         = $shellyIp
            netmask    = '255.255.255.0'
            gw         = '192.168.137.1'
            nameserver = '192.168.137.1'
        }
    }
} | ConvertTo-Json -Depth 5

$r = Invoke-RestMethod -Uri "http://$shellyIp/rpc/WiFi.SetConfig" `
     -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 5

Write-Host "  WiFi.SetConfig: $($r | ConvertTo-Json -Compress)" -ForegroundColor Green

# 3. Reboot so the static IP takes effect
Write-Host "  Rebooting Shelly..." -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "http://$shellyIp/rpc/Shelly.Reboot" `
        -Method POST -Body '{}' -ContentType 'application/json' -TimeoutSec 5 | Out-Null
} catch {} # reboot drops the connection — that's expected

Write-Host ""
Write-Host "Done. The Shelly will reconnect in ~10 seconds at $shellyIp permanently." -ForegroundColor Green
Write-Host "You only need to run this script once." -ForegroundColor Yellow
