from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import (
    Company, Customer, Supplier, Product, Inventory,
    Invoice, InvoiceItem, PurchaseOrder, PurchaseItem,
    Payment, WhatsAppQueue, CompanySettings, UserProfile
)

def status_view(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'ATC ERP Server is running'
    })

# ============================================================
# ADD YOUR OTHER VIEWS BELOW
# ============================================================
