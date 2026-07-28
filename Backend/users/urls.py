from django.urls import path
from .views import list_counselors, register_student, register_counselor

urlpatterns = [
    path('register/', register_student, name='student-register'),
    path('counselors/register/', register_counselor, name='register-counselor'),
    path('counselors/', list_counselors, name='list-counselors'),
]