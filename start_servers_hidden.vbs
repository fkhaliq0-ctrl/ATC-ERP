CreateObject("WScript.Shell").Run "cmd /c cd /d E:\ATC-ERP\backend && python manage.py runserver 5001", 0, False
CreateObject("WScript.Shell").Run "cmd /c cd /d E:\ATC-ERP\frontend && npm run dev", 0, False
CreateObject("WScript.Shell").Run "cmd /c cd /d E:\ATC-ERP\baileys-server && node server.js", 0, False