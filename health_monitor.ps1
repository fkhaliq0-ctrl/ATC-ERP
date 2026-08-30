# ATC ERP - Health Monitor
# Checks servers every 5 minutes and restarts if needed

while (True) {
    # Check if React is running
    pm2 status | findstr "react-frontend" | findstr "online" > 
    if (-1073741510 -ne 0) {
        Write-Host "⚠️ React crashed, restarting..." -ForegroundColor Yellow
        pm2 start "npm run dev -- --host 0.0.0.0 --port 5173" --name react-frontend --silent
    }
    
    # Check if Django is running
    pm2 status | findstr "django" | findstr "online" > 
    if (-1073741510 -ne 0) {
        Write-Host "⚠️ Django crashed, restarting..." -ForegroundColor Yellow
        pm2 start "python backend/manage.py runserver 0.0.0.0:5001" --name django --silent
    }
    
    # Check if Baileys is running
    pm2 status | findstr "baileys" | findstr "online" > 
    if (-1073741510 -ne 0) {
        Write-Host "⚠️ Baileys crashed, restarting..." -ForegroundColor Yellow
        pm2 start "node baileys-server/server.js" --name baileys --silent
    }
    
    # Save PM2 state
    pm2 save
    
    # Wait 5 minutes before checking again
    Start-Sleep -Seconds 300
}
