from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from aliases.models import AliasMapping
from aliases.utils import encrypt, generate_alias
from otp.utils import create_and_send_otp
from .models import User
from .permissions import IsAdmin
from audit.utils import log_event
from .serializers import StudentRegisterSerializer, CounselorRegisterSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def register_counselor(request):
    serializer = CounselorRegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    user = serializer.save()
    log_event(actor=request.user, action='COUNSELOR_REGISTERED', alias=user.email, request=request)

    return Response({
        'message': 'Counselor registered successfully.',
        'id': user.id,
        'email': user.email,
        'full_name': user.full_name,
    }, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def list_counselors(request):
    counselors = User.objects.filter(role='counselor').values('id', 'email', 'full_name')
    return Response(list(counselors), status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_student(request):
    serializer = StudentRegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    user = serializer.save()

    name_ciphertext, iv = encrypt(serializer.validated_data['full_name'])
    email_ciphertext, _ = encrypt(user.email)

    alias = generate_alias()

    while AliasMapping.objects.filter(alias_code=alias).exists():
        alias = generate_alias()

    alias_mapping = AliasMapping.objects.create(
        student=user,
        alias_code=alias,
        real_name_encrypted=name_ciphertext,
        real_email_encrypted=email_ciphertext,
        encryption_iv=iv,
    )

    create_and_send_otp(user.email)

    return Response({
        'message': 'Registration successful. OTP sent for verification.',
        'alias': alias_mapping.alias_code,
    }, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def list_counselors(request):
    counselors = User.objects.filter(role='counselor').values('id', 'email')
    return Response(list(counselors), status=200)