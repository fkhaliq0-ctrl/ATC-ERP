import requests
import json
from django.conf import settings

class WhatsAppService:
    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID if hasattr(settings, 'TWILIO_ACCOUNT_SID') else ''
        self.auth_token = settings.TWILIO_AUTH_TOKEN if hasattr(settings, 'TWILIO_AUTH_TOKEN') else ''
        self.from_number = settings.TWILIO_WHATSAPP_NUMBER if hasattr(settings, 'TWILIO_WHATSAPP_NUMBER') else ''
        self.base_url = f'https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json'
    
    def send_whatsapp_message(self, to_number, message):
        if not self.account_sid or not self.auth_token:
            print("⚠️ Twilio credentials not configured. Message would be:")
            print(f"To: {to_number}")
            print(f"Message: {message}")
            return False
        
        try:
            response = requests.post(
                self.base_url,
                auth=(self.account_sid, self.auth_token),
                data={
                    'From': f'whatsapp:{self.from_number}',
                    'To': f'whatsapp:{to_number}',
                    'Body': message
                }
            )
            
            if response.status_code == 201:
                print(f"✅ WhatsApp message sent to {to_number}")
                return True
            else:
                print(f"❌ Failed to send message: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error sending WhatsApp message: {str(e)}")
            return False

    def generate_menu_link(self, inquiry_id, customer_phone):
        base_url = 'https://atc-geca.onrender.com'
        return f"{base_url}/menu?inquiry={inquiry_id}&phone={customer_phone}"

    def build_message(self, inquiry):
        menu_link = self.generate_menu_link(inquiry.id, inquiry.customer_phone)
        greeting = inquiry.greeting_used or "Dear Sir/Madam"
        
        if inquiry.customer_type == 'IICC':
            return f"""{greeting},

Zebaish Caterers extends warmest congratulations to you on your upcoming event at the India Islamic Cultural Centre, New Delhi.

We are honored to be an empanelled caterer & event organizer at IICC and would love to be a part of your special day.

We specialize in Authentic Indian, Mughlai & Vegetarian Cuisine, curated with Delhi's finest chefs to deliver:
✅ Exceptional Taste
✅ Unparalleled Quality
✅ Impeccable Presentation & Service

You can explore our work here:
📷 https://www.instagram.com/zebaish.caterers

To customize your event, please select your preferred menu options using our convenient online link:
🔗 {menu_link}

For any queries:
📞 +91 99999 50056
📞 +91 98999 54606

Zebaish Caterers
Empanelled Caterer & Event Organizer - IICC, New Delhi"""
        else:
            return f"""{greeting},

Zebaish Caterers extends warm congratulations on your upcoming event!

We are honored to introduce our exceptional catering services. Specializing in authentic Indian, Mughlai, and vegetarian cuisine, we partner with Delhi's finest chefs to deliver:
✅ Exceptional taste
✅ Unparalleled quality
✅ Immaculate presentation

Explore our Instagram page for culinary inspiration:
📷 https://www.instagram.com/zebaish.caterers

To personalize your event, please select your preferred menu options using our convenient online link:
🔗 {menu_link}

Contact Us:
📞 +91 99999 50056 | 📞 +91 98999 54606

Zebaish Caterers — A Unit of Allied Trading Corporation"""
