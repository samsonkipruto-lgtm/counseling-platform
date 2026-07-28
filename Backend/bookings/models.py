from django.conf import settings
from django.db import models

from aliases.models import AliasMapping


class SessionSlot(models.Model):
    counselor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='session_slots', limit_choices_to={'role': 'counselor'}
    )
    slot_datetime = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name='created_slots', limit_choices_to={'role': 'admin'}
    )

    def __str__(self):
        return f"{self.counselor.email} @ {self.slot_datetime}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('waiting', 'Waiting'),
        ('in-session', 'In Session'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    alias = models.ForeignKey(
        AliasMapping, on_delete=models.CASCADE, to_field='alias_code',
        related_name='bookings'
    )
    counselor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='bookings', limit_choices_to={'role': 'counselor'}
    )
    slot = models.OneToOneField(SessionSlot, on_delete=models.CASCADE, related_name='booking')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='waiting')
    booked_at = models.DateTimeField(auto_now_add=True)
    identity_revealed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.alias.alias_code} - {self.slot.slot_datetime} ({self.status})"