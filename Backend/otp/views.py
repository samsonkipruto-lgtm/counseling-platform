from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from audit.utils import log_event
from users.models import User
from .utils import create_and_send_otp, verify_otp, check_rate_limit


@api_view(['POST'])
@permission_classes([AllowAny])
def request_otp(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'email is required'}, status=400)

    if not check_rate_limit(email):
        return Response({'error': 'Too many OTP requests. Try again later.'}, status=429)

    try:
        User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'No account found with this email'}, status=404)

    create_and_send_otp(email)
    log_event(actor=None, action='OTP_REQUEST', alias='', request=request)
    return Response({'message': 'OTP sent'}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_view(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    if not email or not otp:
        return Response({'error': 'email and otp are required'}, status=400)

    if not verify_otp(email, otp):
        return Response({'error': 'Invalid or expired OTP'}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    log_event(actor=user, action='LOGIN', request=request)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'role': user.role,
    }, status=200)