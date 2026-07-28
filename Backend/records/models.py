from django.conf import settings
from django.db import models

from bookings.models import Booking


class CounselingRecord(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='record')
    counselor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='records', limit_choices_to={'role': 'counselor'}
    )
    notes_encrypted = models.TextField()
    encryption_iv = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Record for booking {self.booking_id}"