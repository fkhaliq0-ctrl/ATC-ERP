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
    try:
        serializer = MenuSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            submission = serializer.save()
            return Response({
                'message': 'Menu submitted successfully',
                'submission': serializer.data,
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
