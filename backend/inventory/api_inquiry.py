from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Inquiry
from .whatsapp_service import WhatsAppService

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'

@api_view(['POST'])
def create_inquiry(request):
    serializer = InquirySerializer(data=request.data)
    if serializer.is_valid():
        inquiry = serializer.save()
        
        # Send WhatsApp message
        whatsapp = WhatsAppService()
        message = whatsapp.build_message(inquiry)
        
        # Send the message
        message_sent = whatsapp.send_whatsapp_message(
            inquiry.customer_phone,
            message
        )
        
        return Response({
            'message': 'Inquiry created successfully',
            'inquiry': serializer.data,
            'whatsapp_sent': message_sent
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)