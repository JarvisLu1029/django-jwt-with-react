from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    info = {
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
    }

    print(info)

    return Response(info)