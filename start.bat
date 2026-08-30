@echo off
echo ============================================
echo       Starting ATC ERP...
echo ============================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /c "cd backend && py -3.12 manage.py runserver"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /c "cd frontend && npm run dev -- --host"

echo.
echo ============================================
echo       ATC ERP is running!
echo ============================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Agent Page: http://localhost:5173/agent
echo Menu Page:  http://localhost:5173/menu
echo Dashboard:  http://localhost:5173/dashboard
echo Admin:      http://localhost:8000/admin
echo.
echo Press any key to stop the servers...
pause >nul

echo Stopping servers...
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Backend Server*"
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Frontend Server*"
echo Servers stopped.
pause
