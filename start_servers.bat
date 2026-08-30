@echo off
title ATC ERP - Server Starter
echo ========================================
echo Starting ATC ERP Servers...
echo ========================================

echo Starting Django Backend (Port 5001)...
start /min "Django Server" cmd /c "cd /d E:\ATC-ERP\backend && python manage.py runserver 5001"

timeout /t 3 /nobreak >nul

echo Starting React Frontend (Port 5173)...
start /min "React Server" cmd /c "cd /d E:\ATC-ERP\frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Baileys WhatsApp (Port 3001)...
start /min "Baileys Server" cmd /c "cd /d E:\ATC-ERP\baileys-server && node server.js"

echo ========================================
echo All Servers Started Successfully!
echo ========================================
echo.
echo Access the app at: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul