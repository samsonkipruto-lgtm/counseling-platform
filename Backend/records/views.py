from audit.utils import log_event
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from aliases.utils import encrypt
from bookings.models import Booking
from users.permissions import IsCounselor
from .models import CounselingRecord
from .serializers import RecordCreateSerializer, RecordDisplaySerializer, RecordUpdateSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsCounselor])
def create_record(request):
    serializer = RecordCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    booking_id = serializer.validated_data['booking_id']
    notes = serializer.validated_data['notes']

    try:
        booking = Booking.objects.get(id=booking_id, counselor=request.user)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found or not assigned to you'}, status=404)

    if hasattr(booking, 'record'):
        return Response({'error': 'A record already exists for this booking. Use update instead.'}, status=409)

    ciphertext, iv = encrypt(notes)
    record = CounselingRecord.objects.create(
        booking=booking,
        counselor=request.user,
        notes_encrypted=ciphertext,
        encryption_iv=iv,
    )

    log_event(actor=request.user, action='RECORD_CREATE', alias=booking.alias.alias_code, request=request)

    return Response(RecordDisplaySerializer(record).data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCounselor])
def get_record(request, record_id):
    try:
        record = CounselingRecord.objects.get(id=record_id, counselor=request.user)
    except CounselingRecord.DoesNotExist:
        return Response({'error': 'Record not found'}, status=404)

    return Response(RecordDisplaySerializer(record).data, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsCounselor])
def update_record(request, record_id):
    try:
        record = CounselingRecord.objects.get(id=record_id, counselor=request.user)
    except CounselingRecord.DoesNotExist:
        return Response({'error': 'Record not found'}, status=404)

    serializer = RecordUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    ciphertext, iv = encrypt(serializer.validated_data['notes'])
    record.notes_encrypted = ciphertext
    record.encryption_iv = iv
    record.save()

    log_event(actor=request.user, action='RECORD_UPDATE', alias=record.booking.alias.alias_code, request=request)

    return Response(RecordDisplaySerializer(record).data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCounselor])
def get_record_by_booking(request, booking_id):
    try:
        record = CounselingRecord.objects.get(booking_id=booking_id, counselor=request.user)
    except CounselingRecord.DoesNotExist:
        return Response({'error': 'No record found for this booking'}, status=404)

    return Response(RecordDisplaySerializer(record).data, status=200)