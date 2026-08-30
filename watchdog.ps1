# Watchdog Script - Checks if servers are running and restarts them if needed
# Location: E:\ATC-ERP\watchdog.ps1

while (True) {
    # Check if PM2 processes are running
     = pm2 status --no-color
    
    if ( -match 'offline') {
        Write-Host "08/18/2026 13:39:23 - Servers offline, restarting..." -ForegroundColor Yellow
        pm2 start all
        Start-Sleep -Seconds 5
    } elseif ( -match 'stopped') {
        Write-Host "08/18/2026 13:39:23 - Servers stopped, restarting..." -ForegroundColor Yellow
        pm2 start all
        Start-Sleep -Seconds 5
    } else {
        Write-Host "08/18/2026 13:39:23 - All servers running fine" -ForegroundColor Green
    }
    
    # Wait 60 seconds before next check
    Start-Sleep -Seconds 60
}
