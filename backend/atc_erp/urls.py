from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Welcome page function
def home(request):
    return HttpResponse("""
        <h1>Welcome to ATC ERP</h1>
        <p>Agent Page: <a href='/agent/'>/agent/</a></p>
        <p>Menu Page: <a href='/menu/'>/menu/</a></p>
        <p>Admin: <a href='/admin/'>/admin/</a></p>
    """)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('inventory.urls')),
    path('', home),  # This handles the root URL (/)
]