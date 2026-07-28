from django.contrib import admin
from .models import Booking, SessionSlot


@admin.register(SessionSlot)
class SessionSlotAdmin(admin.ModelAdmin):
    list_display = ('id', 'counselor', 'slot_datetime', 'is_available', 'created_by')
    list_filter = ('is_available', 'counselor')
    ordering = ('slot_datetime',)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'alias', 'counselor', 'slot', 'status', 'booked_at')
    list_filter = ('status', 'counselor')
    ordering = ('-booked_at',)