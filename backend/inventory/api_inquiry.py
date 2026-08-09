from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'

@api_view(['POST'])
def create_inquiry(request):
    # Map frontend field names to model field names
    data = request.data.copy()
    
    # Map customerPhone to customer_phone
    if 'customerPhone' in data:
        data['customer_phone'] = data.pop('customerPhone')
    
    # Map customerName to customer_name
    if 'customerName' in data:
        data['customer_name'] = data.pop('customerName')
    
    serializer = InquirySerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
