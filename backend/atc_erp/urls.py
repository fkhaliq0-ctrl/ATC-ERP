from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return HttpResponse("""
        <h1>Welcome to ATC ERP</h1>
        <p><a href='/agent/'>📱 Agent Page</a></p>
        <p><a href='/menu/'>📋 Menu Page</a></p>
        <p><a href='/dashboard/'>📊 Dashboard</a></p>
        <p><a href='/admin/'>🔐 Admin Panel</a></p>
        <hr>
        <p style='color: green;'>✅ Your ATC ERP is LIVE!</p>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inventory.urls')),
    path('agent/', home),  # Show home page temporarily
    path('menu/', home),   # Show home page temporarily
    path('dashboard/', home),  # Show home page temporarily
    path('', home, name='home'),
]