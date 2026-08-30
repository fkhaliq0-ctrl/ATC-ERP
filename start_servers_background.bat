@echo off
title ATC ERP - Background Servers
echo Starting ATC ERP Servers in Background...
echo.

echo Starting Django Backend...
start /min cmd /c "cd /d E:\ATC-ERP\backend && python manage.py runserver 5001"

timeout /t 2 /nobreak >nul

echo Starting React Frontend...
start /min cmd /c "cd /d E:\ATC-ERP\frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Baileys WhatsApp...
start /min cmd /c "cd /d E:\ATC-ERP\baileys-server && node server.js"

echo.
echo ✅ All Servers Started in Background!
echo.
echo Access the app at: http://localhost:5173
echo.
echo The windows are minimized. Do not close them.
pause >nul