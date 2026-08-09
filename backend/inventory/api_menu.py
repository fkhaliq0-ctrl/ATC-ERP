from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MenuSubmission

class MenuSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuSubmission
        fields = '__all__'

@api_view(['POST'])
def create_menu_submission(request):
    serializer = MenuSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)