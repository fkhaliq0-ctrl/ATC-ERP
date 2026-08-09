@echo off
echo Backing up ATC ERP Database...
copy E:\ATC-ERP\backend\db.sqlite3 E:\ATC-ERP\database\backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sqlite3
echo Backup completed!
