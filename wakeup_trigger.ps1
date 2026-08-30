# ATC ERP - Wake/Resume Script
# This runs automatically when Windows wakes from sleep

Write-Host "🔄 ATC ERP: Waking up from sleep..." -ForegroundColor Yellow

# Navigate to project
cd E:\ATC-ERP

# Check if PM2 is running
pm2 status

# If servers are stopped, restart them
if (-1073741510 -ne 0) {
    Write-Host "⚠️ Servers stopped, restarting..." -ForegroundColor Yellow
    pm2 resurrect
}

# Ensure React is running
pm2 status | findstr "react-frontend" | findstr "online"
if (-1073741510 -ne 0) {
    Write-Host "🔄 React not running, restarting..." -ForegroundColor Yellow
    pm2 start "npm run dev -- --host 0.0.0.0 --port 5173" --name react-frontend --silent
}

# Ensure Django is running
pm2 status | findstr "django" | findstr "online"
if (-1073741510 -ne 0) {
    Write-Host "🔄 Django not running, restarting..." -ForegroundColor Yellow
    pm2 start "python backend/manage.py runserver 0.0.0.0:5001" --name django --silent
}

# Ensure Baileys is running
pm2 status | findstr "baileys" | findstr "online"
if (-1073741510 -ne 0) {
    Write-Host "🔄 Baileys not running, restarting..." -ForegroundColor Yellow
    pm2 start "node baileys-server/server.js" --name baileys --silent
}

pm2 save
Write-Host "✅ All servers restarted!" -ForegroundColor Green
