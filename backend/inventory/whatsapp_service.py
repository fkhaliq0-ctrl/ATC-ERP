import requests
from django.conf import settings
import os
import base64
import json
import traceback
import re
import time

def send_whatsapp_pdf(phone_number, pdf_content, filename):
    try:
        # phone_number should already include country code from form
        # Format: +91XXXXXXXXXX or 91XXXXXXXXXX or XXXXXXXXXX
        phone = phone_number.replace(' ', '').replace('-', '').strip()
        
        # If number has no +, add it
        if not phone.startswith('+'):
            # If number starts with country code without +
            if phone.startswith('91') and len(phone) == 12:
                phone = '+' + phone
            else:
                # For Indian numbers without country code (10 digits)
                if len(phone) == 10:
                    phone = '+91' + phone
                elif len(phone) == 11 and phone.startswith('0'):
                    phone = '+91' + phone[1:]
                else:
                    # For other numbers, just add +
                    phone = '+' + phone
        
        print(f"📱 Sending WhatsApp to: {phone}")
        print(f"📄 Filename: {filename}")
        print(f"📄 PDF size: {len(pdf_content)} bytes")
        
        # Baileys server URL
        baileys_url = 'http://localhost:3001'
        
        # Check if Baileys is running
        try:
            status_response = requests.get(f'{baileys_url}/api/status', timeout=3)
            print(f"✅ Baileys status: {status_response.status_code}")
        except Exception as e:
            return False, f"Baileys not reachable: {str(e)}"
        
        # Encode PDF to base64
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        
        # Send to Baileys
        payload = {
            'to': phone,
            'message': f'Please find your invoice attached: {filename}',
            'pdf_base64': pdf_base64,
            'filename': filename
        }
        
        print("📤 Sending to Baileys...")
        
        # Retry up to 2 times if Baileys returns 503 (still reconnecting)
        max_retries = 2
        for attempt in range(max_retries + 1):
            response = requests.post(
                f'{baileys_url}/api/send-pdf',
                json=payload,
                timeout=60
            )
            
            print(f"📥 Baileys response: {response.status_code} (attempt {attempt + 1})")
            
            if response.status_code == 200:
                return True, "WhatsApp sent successfully!"
            elif response.status_code == 503 and attempt < max_retries:
                print(f"⏳ Baileys not ready yet, retrying in 5 seconds...")
                time.sleep(5)
                continue
            else:
                return False, f"Baileys error: {response.status_code} - {response.text}"
            
    except requests.exceptions.ConnectionError:
        return False, "Cannot connect to Baileys server. Make sure it's running on port 3001"
    except requests.exceptions.Timeout:
        return False, "Timeout connecting to Baileys server"
    except Exception as e:
        print(f"❌ Full error: {traceback.format_exc()}")
        return False, f"Error: {str(e)}"
