from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'
        extra_kwargs = {
            'religion': {'required': False, 'allow_null': True},
            'gender': {'required': False, 'allow_null': True},
            'customer_name': {'required': False, 'allow_null': True},
            'customer_phone': {'required': True},
            'customer_type': {'required': False},
            'greeting_used': {'required': False},
            'status': {'required': False},
        }

@api_view(['POST'])
def create_inquiry(request):
    try:
        print(f"📝 Received data: {request.data}")
        
        # Ensure required fields are present
        if not request.data.get('customer_phone'):
            return Response({
                'message': 'Contact Number is required',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
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
            print(f"❌ Validation errors: {serializer.errors}")
            return Response({
                'message': 'Validation failed',
                'errors': serializer.errors,
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return Response({
            'message': f'Error: {str(e)}',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)