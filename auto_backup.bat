@echo off
set BACKUP_DIR=E:\ATC-ERP\database\backups
set DATABASE_FILE=E:\ATC-ERP\backend\db.sqlite3
set TIMESTAMP=%DATE:~-4,4%%DATE:~-10,2%%DATE:~-7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%

:: Create backup directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

:: Copy database with timestamp
copy "%DATABASE_FILE%" "%BACKUP_DIR%\backup_%TIMESTAMP%.sqlite3"

:: Keep only last 10 backups to save space
for /f "skip=10 delims=" %%f in ('dir /b /o-d "%BACKUP_DIR%\*.sqlite3"') do (
    del "%BACKUP_DIR%\%%f"
)

echo Backup completed at %DATE% %TIME%
