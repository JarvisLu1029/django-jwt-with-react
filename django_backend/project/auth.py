from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()


@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': '用戶名稱已存在'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email 已被使用'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 6:
        return Response({'error': '密碼需至少 6 碼'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()

    # 註冊完成後自動登入，回傳 JWT Token
    refresh = RefreshToken.for_user(user)
    return Response({
        'message': '註冊成功',
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)


# 取得 JWT Token
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'error': 'Invalid credentials'}, status=400)


# 登出 (讓 Token 失效)
@api_view(['POST'])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')  # 從請求 body 獲取 Refresh Token
        token = RefreshToken(refresh_token)  # 創建 RefreshToken 實例
        token.blacklist()  # 加入黑名單

        return Response({'message': 'Logged out successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    return Response({'message': 'Token is valid'})