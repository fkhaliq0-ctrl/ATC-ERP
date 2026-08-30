from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Sum, Count
from .models import Invoice, Customer


def today_sales(request):
    """GET /api/sales/today/ - Today's sales count and total amount"""
    try:
        today = timezone.now().date()
        invoices = Invoice.objects.filter(invoice_date=today)
        result = invoices.aggregate(total=Sum('total_amount'), count=Count('id'))
        return JsonResponse({
            'total': float(result['total'] or 0),
            'count': result['count'] or 0,
            'date': str(today),
        })
    except Exception as e:
        return JsonResponse({'total': 0, 'count': 0, 'error': str(e)})


def month_sales(request):
    """GET /api/sales/month/ - This month's sales count and total amount"""
    try:
        today = timezone.now().date()
        invoices = Invoice.objects.filter(
            invoice_date__year=today.year,
            invoice_date__month=today.month,
        )
        result = invoices.aggregate(total=Sum('total_amount'), count=Count('id'))
        return JsonResponse({
            'total': float(result['total'] or 0),
            'count': result['count'] or 0,
            'month': today.strftime('%Y-%m'),
        })
    except Exception as e:
        return JsonResponse({'total': 0, 'count': 0, 'error': str(e)})


def total_customers(request):
    """GET /api/customers/total/ - Total customer count"""
    try:
        count = Customer.objects.count()
        return JsonResponse({'count': count, 'total': count})
    except Exception as e:
        return JsonResponse({'count': 0, 'total': 0, 'error': str(e)})


def recent_invoices(request):
    """GET /api/invoices/recent/ or /api/sales/recent/ - Last N invoices"""
    try:
        limit = int(request.GET.get('limit', 5))
        invoices = Invoice.objects.all().order_by('-id')[:limit]
        results = []
        for inv in invoices:
            results.append({
                'id': inv.id,
                'invoice_no': inv.invoice_no,
                'customer': inv.customer_name,
                'customer_name': inv.customer_name,
                'total_amount': float(inv.total_amount),
                'total': float(inv.total_amount),
                'date': inv.invoice_date.strftime('%Y-%m-%d') if inv.invoice_date else '',
            })
        return JsonResponse({'results': results, 'invoices': results})
    except Exception as e:
        return JsonResponse({'results': [], 'invoices': [], 'error': str(e)})
