from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from datetime import datetime, timedelta

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
    expires_time = datetime.now() + timedelta(days=7)  # 7 天後過期

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # 設置 HttpOnly Cookie 存放 refresh_token
        response = Response({
            "access": access_token,
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role if hasattr(user, "role") else "user",
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,  # 防止 XSS
            secure=True,  # 如設定為 False 在開發環境會無法正常傳遞
            samesite="None",
            max_age=7 * 24 * 60 * 60,  # 7 天
            expires=expires_time.strftime("%a, %d-%b-%Y %H:%M:%S GMT")
        )

        return response

    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# 登出 (讓 Token 失效)
@api_view(['POST'])
def logout_view(request):
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token is None:
            return Response({'error': 'Refresh token not found in cookies'}, status=400)
        
        token = RefreshToken(refresh_token)  # 創建 RefreshToken 實例
        token.blacklist()  # 加入黑名單
        
        # 清除 Cookie
        response = Response({'message': 'Logged out successfully'})
        response.delete_cookie('refresh_token')
        
        return response
    except Exception as e:
        print(f"Logout error: {e}")
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    return Response({'message': 'Token is valid'})