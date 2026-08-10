from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Inquiry
import json

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'
        extra_kwargs = {
            'religion': {'required': False, 'allow_null': True},
            'gender': {'required': False, 'allow_null': True},
            'customer_name': {'required': False, 'allow_null': True},
            'customer_phone': {'required': True},
            'customer_type': {'required': False, 'allow_null': True},
            'greeting_used': {'required': False, 'allow_null': True},
            'status': {'required': False, 'allow_null': True},
            'agent_name': {'required': False, 'allow_null': True},
        }

@api_view(['POST'])
def create_inquiry(request):
    try:
        print("=" * 60)
        print("📝 RECEIVED RAW DATA:")
        print(json.dumps(request.data, indent=2))
        print("=" * 60)
        
        # Get the raw data
        raw_data = request.data.copy()
        
        # Create a new dict with proper field names
        cleaned_data = {}
        
        # Map camelCase to snake_case
        for key, value in raw_data.items():
            if key == 'customerName':
                cleaned_data['customer_name'] = value
            elif key == 'customerPhone':
                cleaned_data['customer_phone'] = value
            elif key == 'customerType':
                cleaned_data['customer_type'] = value
            elif key == 'greetingUsed':
                cleaned_data['greeting_used'] = value
            else:
                cleaned_data[key] = value
        
        # If customer_phone is still missing, try to get it from raw data
        if not cleaned_data.get('customer_phone'):
            if raw_data.get('customerPhone'):
                cleaned_data['customer_phone'] = raw_data.get('customerPhone')
            elif raw_data.get('customer_phone'):
                cleaned_data['customer_phone'] = raw_data.get('customer_phone')
        
        # Check if we have a phone number
        if not cleaned_data.get('customer_phone'):
            print("❌ No phone number found in data")
            return Response({
                'message': 'Contact Number is required',
                'received_data': raw_data,
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        print("📝 CLEANED DATA:")
        print(json.dumps(cleaned_data, indent=2))
        print("=" * 60)
        
        # Validate and save
        serializer = InquirySerializer(data=cleaned_data)
        
        if serializer.is_valid():
            inquiry = serializer.save()
            print(f"✅ Inquiry created successfully! ID: {inquiry.id}")
            return Response({
                'message': 'Inquiry created successfully',
                'inquiry': serializer.data,
                'status': 'success'
            }, status=status.HTTP_201_CREATED)
        else:
            print(f"❌ VALIDATION ERRORS: {serializer.errors}")
            return Response({
                'message': 'Validation failed',
                'errors': serializer.errors,
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'message': f'Error: {str(e)}',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)