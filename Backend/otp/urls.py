from django.urls import path
from .views import request_otp, verify_otp_view

urlpatterns = [
    path('request/', request_otp, name='otp-request'),
    path('verify/', verify_otp_view, name='otp-verify'),
]