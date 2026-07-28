from django.utils import timezone
from datetime import timedelta
from decouple import config
import africastalking


def assign_counselor(slot):
    """
    Counselor is already fixed on the slot at creation time.
    This confirms availability and marks the slot taken.
    """
    if not slot.is_available:
        return None
    slot.is_available = False
    slot.save()
    return slot.counselor


def check_identity_reveal(booking):
    """
    Returns True if the current time is within 24 hours of the session.
    """
    reveal_threshold = booking.slot.slot_datetime - timedelta(hours=24)
    return timezone.now() >= reveal_threshold


def send_booking_sms(alias_code, slot):
    africastalking.initialize(
        username=config('AT_USERNAME', default='sandbox'),
        api_key=config('AT_API_KEY'),
    )
    sms = africastalking.SMS
    message = f"Booking confirmed for {alias_code} on {slot.slot_datetime.strftime('%Y-%m-%d %H:%M')}."
    # Note: phone number lookup happens at the call site — see views.py
    return message