from rest_framework import serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Inquiry, MenuSubmission

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'

class MenuSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuSubmission
        fields = '__all__'

@api_view(['GET'])
def get_inquiries(request):
    inquiries = Inquiry.objects.all().order_by('-created_at')
    serializer = InquirySerializer(inquiries, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_menu_submissions(request):
    submissions = MenuSubmission.objects.all().order_by('-created_at')
    serializer = MenuSubmissionSerializer(submissions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_dashboard_stats(request):
    total_inquiries = Inquiry.objects.count()
    total_submissions = MenuSubmission.objects.count()
    pending_inquiries = Inquiry.objects.filter(status='New').count()
    
    return Response({
        'total_inquiries': total_inquiries,
        'total_menu_submissions': total_submissions,
        'pending_inquiries': pending_inquiries,
    })