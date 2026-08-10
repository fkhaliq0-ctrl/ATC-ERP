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
        print("=" * 50)
        print("📝 Received data:")
        print(json.dumps(request.data, indent=2))
        print("=" * 50)
        
        serializer = InquirySerializer(data=request.data)
        if serializer.is_valid():
            inquiry = serializer.save()
            print(f"✅ Inquiry created: {inquiry.id}")
            return Response({
                'message': 'Inquiry created successfully',
                'inquiry': serializer.data,
                'status': 'success'
            }, status=status.HTTP_201_CREATED)
        else:
            print(f"❌ Errors: {serializer.errors}")
            return Response({
                'message': 'Validation failed',
                'errors': serializer.errors,
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return Response({
            'message': f'Error: {str(e)}',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)