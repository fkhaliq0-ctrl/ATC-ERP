import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Invoice, InvoiceItem, Customer, Product

@csrf_exempt
def create_invoice(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Create invoice
        invoice = Invoice.objects.create(
            invoice_no=data.get('salesInvoiceNo', 'SI-001'),
            invoice_date=data.get('salesInvoiceDate'),
            book_no=data.get('bookNo', ''),
            customer_id=data.get('customerId') if data.get('customerId') else None,
            customer_name=data.get('customer', 'Walk-in Customer'),
            customer_address=data.get('address', ''),
            customer_state=data.get('state', ''),
            customer_state_code=data.get('stateCode', ''),
            customer_doc_type=data.get('customerDocType', 'GST'),
            customer_doc_number=data.get('customerDocNumber', ''),
            customer_contact=data.get('phone', ''),
            consignee_name=data.get('consigneeName', ''),
            consignee_address=data.get('consigneeAddress', ''),
            consignee_state=data.get('consigneeState', ''),
            consignee_state_code=data.get('consigneeStateCode', ''),
            consignee_doc_type=data.get('consigneeDocType', 'GST'),
            consignee_doc_number=data.get('consigneeDocNumber', ''),
            consignee_contact=data.get('consigneePhone', ''),
            gr_no=data.get('grNo', ''),
            gr_date=data.get('grDate') if data.get('grDate') else None,
            transport_name=data.get('transportName', ''),
            transport_mode=data.get('mode', 'Road'),
            vehicle_no=data.get('vehicleNo', ''),
            brand=data.get('brand', 'Allied Trading Corporation'),
            freight_charges=float(data.get('freight', 0)),
            round_off=float(data.get('roundOff', 0)),
            subtotal=0,
            total_amount=0,
            items_data=data.get('items', [])
        )
        
        # Create invoice items
        subtotal = 0
        for item_data in data.get('items', []):
            amount = float(item_data.get('quantity', 0)) * float(item_data.get('rate', 0))
            gst_rate = float(item_data.get('gst', 0))
            taxable_amount = amount
            gst_amount = amount * (gst_rate / 100)
            total_amount = amount + gst_amount
            
            InvoiceItem.objects.create(
                invoice=invoice,
                item_name=item_data.get('description', ''),
                hsn_code=item_data.get('hsn', ''),
                unit=item_data.get('unit', 'PCS'),
                quantity=float(item_data.get('quantity', 0)),
                rate=float(item_data.get('rate', 0)),
                amount=amount,
                gst_rate=gst_rate,
                taxable_amount=taxable_amount
            )
            subtotal += total_amount
        
        invoice.subtotal = subtotal
        invoice.total_amount = subtotal
        invoice.save()
        
        return JsonResponse({
            'id': invoice.id,
            'invoice_no': invoice.invoice_no,
            'message': 'Invoice created successfully'
        }, status=201)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_next_invoice_number(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        last_invoice = Invoice.objects.order_by('-id').first()
        if last_invoice:
            next_number = int(last_invoice.invoice_no.split('-')[-1]) + 1
        else:
            next_number = 1
        return JsonResponse({'next_invoice_number': str(next_number).zfill(3)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def print_sales_invoice(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    invoice_id = request.GET.get('id')
    if not invoice_id:
        return JsonResponse({'error': 'Invoice ID required'}, status=400)
    
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        items = InvoiceItem.objects.filter(invoice=invoice)
        
        invoice_data = {
            'id': invoice.id,
            'invoice_no': invoice.invoice_no,
            'invoice_date': invoice.invoice_date,
            'customer_name': invoice.customer_name,
            'items': [
                {
                    'item_name': item.item_name,
                    'hsn': item.hsn_code,
                    'quantity': item.quantity,
                    'rate': item.rate,
                    'amount': item.amount,
                    'gst_rate': item.gst_rate
                }
                for item in items
            ],
            'total_amount': invoice.total_amount
        }
        
        return JsonResponse(invoice_data, status=200)
        
    except Invoice.DoesNotExist:
        return JsonResponse({'error': 'Invoice not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
