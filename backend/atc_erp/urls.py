from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.shortcuts import redirect

def home(request):
    return HttpResponse("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>ATC ERP</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    text-align: center;
                    background: #f5f7fa;
                }
                h1 {
                    color: #1e1e2f;
                    font-size: 36px;
                }
                .links {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin: 30px 0;
                }
                .links a {
                    display: inline-block;
                    padding: 15px 30px;
                    background: #4a9eff;
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    font-size: 18px;
                    transition: 0.2s;
                }
                .links a:hover {
                    background: #3a8aee;
                    transform: scale(1.02);
                }
                .green {
                    color: green;
                    font-weight: bold;
                }
                hr {
                    margin: 30px 0;
                }
            </style>
        </head>
        <body>
            <h1>🍽️ Welcome to ATC ERP</h1>
            <div class="links">
                <a href="/agent/">📱 Agent Page</a>
                <a href="/menu/">📋 Menu Page</a>
                <a href="/dashboard/">📊 Dashboard</a>
                <a href="/admin/">🔐 Admin Panel</a>
            </div>
            <hr>
            <p class="green">✅ Your ATC ERP is LIVE!</p>
        </body>
        </html>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inventory.urls')),
    path('agent/', home),  # Will fix this to serve React later
    path('menu/', home),   # Will fix this to serve React later
    path('dashboard/', home),  # Will fix this to serve React later
    path('', home, name='home'),
]