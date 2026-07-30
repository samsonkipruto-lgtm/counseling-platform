from django.urls import path
from .views import (
    cancel_booking, complete_session, create_booking, create_slot, delete_slot,
    get_booking_detail, get_my_booking, get_my_history, list_queue, list_slots,
    list_my_slots, list_slots_by_counselor,
)

urlpatterns = [
    path('slots/', list_slots, name='list-slots'),
    path('my-booking/', get_my_booking, name='my-booking'),
    path('slots/create/', create_slot, name='create-slot'),
    path('slots/<int:slot_id>/', delete_slot, name='delete-slot'),
    path('book/', create_booking, name='create-booking'),
    path('cancel/<int:booking_id>/', cancel_booking, name='cancel-booking'),
    path('queue/', list_queue, name='list-queue'),
    path('booking/<int:booking_id>/', get_booking_detail, name='booking-detail'),
    path('complete/<int:booking_id>/', complete_session, name='complete-session'),
    path('history/', get_my_history, name='my-history'),
    path('slots/mine/', list_my_slots, name='my-slots'),
    path('slots/counselor/<int:counselor_id>/', list_slots_by_counselor, name='counselor-slots'),
]