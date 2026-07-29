import requests
from audit.utils import log_event
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from aliases.models import AliasMapping
from users.permissions import IsAdmin, IsCounselor, IsStudent
from .models import Booking, SessionSlot
from .serializers import CounselorQueueSerializer, SessionSlotSerializer, StudentBookingSerializer
from .utils import assign_counselor, check_identity_reveal, send_booking_confirmation_email


@api_view(['GET'])
@permission_classes([AllowAny])
def list_slots(request):
    slots = SessionSlot.objects.filter(
        is_available=True, slot_datetime__gte=timezone.now()
    ).order_by('slot_datetime')
    serializer = SessionSlotSerializer(slots, many=True)
    return Response(serializer.data, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def create_slot(request):
    counselor_id = request.data.get('counselor_id')
    slot_datetime = request.data.get('slot_datetime')

    if not counselor_id or not slot_datetime:
        return Response({'error': 'counselor_id and slot_datetime are required'}, status=400)

    slot = SessionSlot.objects.create(
        counselor_id=counselor_id,
        slot_datetime=slot_datetime,
        created_by=request.user,
    )
    return Response(SessionSlotSerializer(slot).data, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsStudent])
def create_booking(request):
    slot_id = request.data.get('slot_id')
    if not slot_id:
        return Response({'error': 'slot_id is required'}, status=400)

    try:
        slot = SessionSlot.objects.get(id=slot_id, is_available=True)
    except SessionSlot.DoesNotExist:
        return Response({'error': 'Slot not found or already booked'}, status=404)

    try:
        alias_mapping = AliasMapping.objects.get(student=request.user)
    except AliasMapping.DoesNotExist:
        return Response({'error': 'No alias found for this account'}, status=404)

    counselor = assign_counselor(slot)
    if counselor is None:
        return Response({'error': 'Slot is no longer available'}, status=409)

    booking = Booking.objects.create(
        alias=alias_mapping,
        counselor=counselor,
        slot=slot,
        status='waiting',
    )

    try:
        send_booking_confirmation_email(request.user.email, alias_mapping.alias_code, slot)
    except requests.exceptions.RequestException:
        pass  # booking already succeeded; email failure shouldn't fail the request

    log_event(actor=request.user, action='BOOK', alias=alias_mapping.alias_code, request=request)

    return Response(StudentBookingSerializer(booking).data, status=201)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsStudent])
def cancel_booking(request, booking_id):
    try:
        alias_mapping = AliasMapping.objects.get(student=request.user)
        booking = Booking.objects.get(id=booking_id, alias=alias_mapping)
    except (AliasMapping.DoesNotExist, Booking.DoesNotExist):
        return Response({'error': 'Booking not found'}, status=404)

    booking.status = 'cancelled'
    booking.save()

    booking.slot.is_available = True
    booking.slot.save()

    log_event(actor=request.user, action='CANCEL', alias=booking.alias.alias_code, request=request)

    return Response({'message': 'Booking cancelled'}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_queue(request):
    if request.user.role == 'counselor':
        bookings = Booking.objects.filter(counselor=request.user).exclude(status__in=['cancelled', 'completed'])
    elif request.user.role == 'admin':
        bookings = Booking.objects.exclude(status__in=['cancelled', 'completed'])
    else:
        return Response({'error': 'Not permitted'}, status=403)

    bookings = bookings.order_by('slot__slot_datetime')
    serializer = CounselorQueueSerializer(bookings, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCounselor])
def get_booking_detail(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, counselor=request.user)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)

    if check_identity_reveal(booking) and booking.identity_revealed_at is None:
        booking.identity_revealed_at = timezone.now()
        booking.save()
        log_event(actor=request.user, action='REVEAL', alias=booking.alias.alias_code, request=request)

    serializer = CounselorQueueSerializer(booking)
    return Response(serializer.data, status=200)



@api_view(['POST'])
@permission_classes([IsAuthenticated, IsCounselor])
def complete_session(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, counselor=request.user)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)

    if booking.status == 'cancelled':
        return Response({'error': 'Cannot complete a cancelled booking'}, status=400)

    if booking.status == 'completed':
        return Response({'error': 'Session already marked complete'}, status=400)

    booking.status = 'completed'
    booking.save()

    log_event(actor=request.user, action='SESSION_COMPLETE', alias=booking.alias.alias_code, request=request)

    return Response(CounselorQueueSerializer(booking).data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def get_my_booking(request):
    try:
        alias_mapping = AliasMapping.objects.get(student=request.user)
    except AliasMapping.DoesNotExist:
        return Response({'error': 'No alias found for this account'}, status=404)

    booking = Booking.objects.filter(
        alias=alias_mapping
    ).exclude(status__in=['cancelled', 'completed']).order_by('slot__slot_datetime').first()

    if not booking:
        return Response(None, status=200)

    return Response(StudentBookingSerializer(booking).data, status=200)