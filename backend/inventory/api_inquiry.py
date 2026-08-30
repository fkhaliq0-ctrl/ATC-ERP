from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'
        extra_kwargs = {
            'agent_phone': {'required': False, 'allow_null': True},
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
        data = request.data.copy()
        if not data.get('customer_phone'):
            return Response({
                'message': 'Contact Number is required',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = InquirySerializer(data=data)
        if serializer.is_valid():
            inquiry = serializer.save()
            return Response({
                'message': 'Inquiry created successfully',
                'inquiry': serializer.data,
                'status': 'success'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message': 'Validation failed',
                'errors': serializer.errors,
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'message': f'Error: {str(e)}',
            'status': 'error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
