from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inventory.urls')),
    path('agent/', lambda request: HttpResponseRedirect('/agent/')),  # Add this
    path('menu/', lambda request: HttpResponseRedirect('/menu/')),    # Add this
    path('', lambda request: HttpResponse("""
        <h1>Welcome to ATC ERP</h1>
        <p><a href='/agent/'>Agent Page</a></p>
        <p><a href='/menu/'>Menu Page</a></p>
        <p><a href='/dashboard/'>Dashboard</a></p>
        <p><a href='/admin/'>Admin</a></p>
    """)),
]