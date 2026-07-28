from django.urls import path
from .views import get_my_alias, reveal_identity

urlpatterns = [
    path('my-alias/', get_my_alias, name='my-alias'),
    path('reveal/<int:booking_id>/', reveal_identity, name='reveal-identity'),
]