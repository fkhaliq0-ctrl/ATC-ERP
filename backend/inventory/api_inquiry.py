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
        }

@api_view(['POST'])
def create_inquiry(request):
    try:
        print("=" * 60)
        print("📝 RECEIVED DATA:")
        print(json.dumps(request.data, indent=2))
        print("=" * 60)
        
        data = request.data.copy()
        
        # Map religion values if needed
        if data.get('religion') == 'Muslim':
            data['religion'] = 'M'
        elif data.get('religion') == 'Non-Muslim':
            data['religion'] = 'NM'
        
        # Ensure customer_phone is present
        if not data.get('customer_phone'):
            return Response({
                'message': 'Contact Number is required',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate the data
        serializer = InquirySerializer(data=data)
        
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