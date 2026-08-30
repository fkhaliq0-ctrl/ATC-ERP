import os
import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from .models import Invoice, InvoiceItem, Customer, Supplier
from .pdf_utils import generate_pdf, save_pdf_to_desktop
import requests

# ============================================================
# PDF GENERATION API
# ============================================================

@csrf_exempt
def generate_pdf_api(request):
    """Generate PDF for Invoice"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        invoice_id = data.get('invoice_id')
        invoice_type = data.get('invoice_type', 'sales')
        file_name = data.get('file_name', 'Invoice')
        save_path = data.get('save_path', 'C:\\\\Users\\\\Lenovo\\\\Desktop\\\\ATC_Invoices')
        send_whatsapp = data.get('send_whatsapp', False)
        whatsapp_message = data.get('whatsapp_message', '')
        
        # Get invoice data
        if invoice_type == 'sales':
            invoice = Invoice.objects.get(id=invoice_id)
            
            invoice_data = {
                'invoiceNo': invoice.invoice_no,
                'salesInvoiceDate': str(invoice.invoice_date),
                'bookNo': invoice.book_no or '',
                'customerOrderNo': '',
                'orderDate': '',
                'customer': invoice.customer_name or '',
                'customer_id': invoice.customer_id,
                'address': invoice.customer_address or '',
                'city': '',
                'state': invoice.customer_state or '',
                'stateCode': invoice.customer_state_code or '',
                'country': 'India',
                'phone': invoice.customer_contact or '',
                'gstin': invoice.customer_doc_number or '',
                'pan': '',
                'consigneeName': invoice.consignee_name or '',
                'consigneeAddress': invoice.consignee_address or '',
                'consigneeCity': '',
                'consigneeState': invoice.consignee_state or '',
                'consigneeStateCode': invoice.consignee_state_code or '',
                'consigneeCountry': 'India',
                'consigneePhone': invoice.consignee_contact or '',
                'grNo': invoice.gr_no or '',
                'grDate': str(invoice.gr_date) if invoice.gr_date else '',
                'transportName': invoice.transport_name or '',
                'mode': invoice.transport_mode or 'Road',
                'vehicleNo': invoice.vehicle_no or '',
                'brand': invoice.brand or 'Allied Trading Corporation',
                'freight': float(invoice.freight_charges or 0),
                'roundOff': float(invoice.round_off or 0),
                'items': [],
                'subtotal': 0,
                'taxAmount': 0,
                'grandTotal': 0,
            }
            
            # Get items from the invoice
            items = InvoiceItem.objects.filter(invoice_id=invoice_id)
            for item in items:
                invoice_data['items'].append({
                    'category': '',
                    'description': item.item_name or '',
                    'hsn': item.hsn_code or '',
                    'unit': item.unit or '',
                    'quantity': float(item.quantity or 0),
                    'rate': float(item.rate or 0),
                    'amount': float(item.amount or 0),
                    'gst': float(item.gst_rate or 0),
                })
            
            # Calculate totals
            subtotal = sum(item.get('amount', 0) for item in invoice_data['items'])
            tax_amount = sum((item.get('amount', 0) * item.get('gst', 0) / 100) for item in invoice_data['items'])
            grand_total = subtotal + tax_amount + invoice_data['freight'] + invoice_data['roundOff']
            
            invoice_data['subtotal'] = subtotal
            invoice_data['taxAmount'] = tax_amount
            invoice_data['grandTotal'] = grand_total
            invoice_data['totalAmount'] = grand_total
            
        else:
            invoice = Invoice.objects.get(id=invoice_id)
            invoice_data = {
                'invoiceNo': invoice.invoice_no,
                'salesInvoiceDate': str(invoice.invoice_date),
                'bookNo': '',
                'customer': invoice.customer_name or '',
                'address': invoice.customer_address or '',
                'city': '',
                'state': invoice.customer_state or '',
                'country': 'India',
                'phone': invoice.customer_contact or '',
                'gstin': invoice.customer_doc_number or '',
                'items': [],
                'subtotal': 0,
                'taxAmount': 0,
                'grandTotal': 0,
                'totalAmount': 0,
            }
        
        # Generate PDF
        pdf_bytes = generate_pdf(invoice_data, file_name)
        
        # Save to desktop
        saved_path = save_pdf_to_desktop(pdf_bytes, file_name, save_path)
        
        # Send WhatsApp if requested
        if send_whatsapp and whatsapp_message:
            customer_phone = invoice_data.get('phone', '')
            if customer_phone:
                send_whatsapp_message(customer_phone, whatsapp_message, pdf_bytes, file_name)
        
        # Return PDF as response
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{file_name}.pdf"'
        return response
        
    except Invoice.DoesNotExist:
        return JsonResponse({'error': 'Invoice not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ============================================================
# CUSTOMER LEDGER API
# ============================================================

@csrf_exempt
def customer_ledger_api(request, customer_id):
    """Get customer outstanding amount"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        invoices = Invoice.objects.filter(
            customer_id=customer_id
        )
        
        total_outstanding = 0
        for invoice in invoices:
            items = InvoiceItem.objects.filter(invoice_id=invoice.id)
            subtotal = sum(item.amount or 0 for item in items)
            total_outstanding += subtotal
        
        return JsonResponse({
            'customer_id': customer_id,
            'outstanding': total_outstanding,
            'unpaid_count': invoices.count(),
            'status': 'success'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ============================================================
# WHATSAPP SEND FUNCTION
# ============================================================

def send_whatsapp_message(phone_number, message, pdf_bytes, file_name):
    """Send WhatsApp message with PDF attachment via Baileys"""
    try:
        baileys_url = 'http://localhost:5002/send-message'
        
        files = {
            'file': (file_name + '.pdf', pdf_bytes, 'application/pdf')
        }
        data = {
            'phone': phone_number,
            'message': message
        }
        
        response = requests.post(baileys_url, data=data, files=files)
        
        if response.status_code == 200:
            return {'success': True, 'message': 'WhatsApp sent successfully'}
        else:
            return {'success': False, 'error': response.text}
            
    except requests.exceptions.ConnectionError:
        return {'success': False, 'error': 'Baileys server not running'}
    except Exception as e:
        return {'success': False, 'error': str(e)}
