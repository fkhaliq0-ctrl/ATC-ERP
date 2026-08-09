from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.http import HttpResponseRedirect

def home(request):
    return HttpResponse("""
        <h1>Welcome to ATC ERP</h1>
        <p><a href='/agent/'>📱 Agent Page</a></p>
        <p><a href='/menu/'>📋 Menu Page</a></p>
        <p><a href='/dashboard/'>📊 Dashboard</a></p>
        <p><a href='/admin/'>🔐 Admin Panel</a></p>
        <hr>
        <p style='color: green;'>✅ Your ATC ERP is live!</p>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inventory.urls')),
    path('agent/', lambda request: HttpResponseRedirect('/agent/')),
    path('menu/', lambda request: HttpResponseRedirect('/menu/')),
    path('dashboard/', lambda request: HttpResponseRedirect('/dashboard/')),
    path('', home, name='home'),
]