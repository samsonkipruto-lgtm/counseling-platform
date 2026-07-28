from django.urls import path
from .views import (
    cancel_booking, create_booking, create_slot,
    get_booking_detail, get_my_booking, list_queue, list_slots,
)

urlpatterns = [
    path('slots/', list_slots, name='list-slots'),
    path('my-booking/', get_my_booking, name='my-booking'),
    path('slots/create/', create_slot, name='create-slot'),
    path('book/', create_booking, name='create-booking'),
    path('cancel/<int:booking_id>/', cancel_booking, name='cancel-booking'),
    path('queue/', list_queue, name='list-queue'),
    path('booking/<int:booking_id>/', get_booking_detail, name='booking-detail'),
]