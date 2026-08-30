from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from inventory import api_sales_invoice, api_dashboard
from inventory.models import Invoice
from inventory.views_pdf import generate_pdf_api, customer_ledger_api

def status_view(request):
    return JsonResponse({"status": "ok", "message": "ATC ERP Server is running"})

def get_invoices(request):
    try:
        invoices = Invoice.objects.all().order_by('-id')[:50]
        data = []
        for inv in invoices:
            data.append({
                'id': inv.id,
                'invoice_no': inv.invoice_no,
                'customer_name': inv.customer_name,
                'total_amount': str(inv.total_amount),
                'date': inv.invoice_date.strftime('%d-%m-%Y') if inv.invoice_date else ''
            })
        return JsonResponse({'invoices': data}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def get_customers(request):
    try:
        from inventory.models import Customer
        customers = Customer.objects.all()
        data = []
        for c in customers:
            data.append({
                'id': c.id,
                'name': c.name,
                'address': c.address,
                'city': c.city,
                'state': c.state,
                'state_code': c.state_code,
                'country': c.country,
                'phone': c.contact,
                'gstin': c.doc_number if c.doc_type == 'GST' else '',
                'pan': c.doc_number if c.doc_type == 'PAN' else '',
            })
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse([], safe=False, status=200)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/status/', status_view, name='status'),
    path('api/sales/today/', api_dashboard.today_sales, name='today_sales'),
    path('api/sales/month/', api_dashboard.month_sales, name='month_sales'),
    path('api/customers/total/', api_dashboard.total_customers, name='total_customers'),
    path('api/invoices/recent/', api_dashboard.recent_invoices, name='recent_invoices'),
    path('api/sales/recent/', api_dashboard.recent_invoices, name='sales_recent'),
    path('api/invoices/', get_invoices, name='invoices'),
    path('api/customers/', get_customers, name='customers'),
    path('api/get-next-invoice-number/', api_sales_invoice.get_next_invoice_number, name='get_next_invoice_number'),
    path('api/create-invoice/', api_sales_invoice.create_invoice, name='create_invoice'),
    path('api/print-sales-invoice/', api_sales_invoice.print_sales_invoice, name='print_sales_invoice'),
    path('api/sales-invoices/', api_sales_invoice.create_invoice, name='sales_invoices'),
    path('api/generate-pdf/', generate_pdf_api, name='generate_pdf'),
    path('api/customer-ledger/<int:customer_id>/', customer_ledger_api, name='customer_ledger'),
]
