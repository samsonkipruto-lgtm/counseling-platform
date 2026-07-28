from datetime import timedelta

import requests
from decouple import config
from django.utils import timezone


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


def send_booking_confirmation_email(email, alias_code, slot):
    response = requests.post(
        'https://api.brevo.com/v3/smtp/email',
        headers={
            'api-key': config('BREVO_API_KEY'),
            'Content-Type': 'application/json',
        },
        json={
            'sender': {'email': config('DEFAULT_FROM_EMAIL')},
            'to': [{'email': email}],
            'subject': 'Booking confirmed',
            'htmlContent': (
                f'<p>Your counseling session is confirmed under alias '
                f'<strong>{alias_code}</strong> for '
                f'{slot.slot_datetime.strftime("%Y-%m-%d %H:%M")}.</p>'
            ),
        },
    )
    response.raise_for_status()