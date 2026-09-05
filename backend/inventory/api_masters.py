from django.http import JsonResponse
from inventory.models import Vendor, Item, Tax, Unit

# ============================================================
# VENDOR API
# ============================================================
def get_vendors(request):
    try:
        vendors = Vendor.objects.all()
        data = []
        for v in vendors:
            data.append({
                'id': v.id,
                'name': v.name,
                'address': v.address,
                'city': v.city,
                'state': v.state,
                'state_code': v.state_code,
                'country': v.country,
                'phone': v.contact,
                'gstin': v.gstin or '',
                'pan': v.pan or '',
            })
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# ============================================================
# ITEM API
# ============================================================
def get_items(request):
    try:
        items = Item.objects.all()
        data = []
        for item in items:
            data.append({
                'id': item.id,
                'name': item.name,
                'category': item.category,
                'hsn': item.hsn or '',
                'unit': item.unit,
                'rate': str(item.rate) if item.rate else '0',
                'gst': str(item.gst) if item.gst else '0',
                'stock': item.stock or 0,
            })
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# ============================================================
# TAX API
# ============================================================
def get_taxes(request):
    try:
        taxes = Tax.objects.all()
        data = []
        for tax in taxes:
            data.append({
                'id': tax.id,
                'name': tax.name,
                'rate': str(tax.rate),
                'type': tax.type,
            })
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# ============================================================
# UNIT API
# ============================================================
def get_units(request):
    try:
        units = Unit.objects.all()
        data = []
        for unit in units:
            data.append({
                'id': unit.id,
                'name': unit.name,
                'code': unit.code,
            })
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
