from django.urls import path
from .views import create_record, get_record, get_record_by_booking, update_record

urlpatterns = [
    path('records/create/', create_record, name='create-record'),
    path('records/by-booking/<int:booking_id>/', get_record_by_booking, name='record-by-booking'),
    path('records/<int:record_id>/', get_record, name='get-record'),
    path('records/<int:record_id>/update/', update_record, name='update-record'),
]