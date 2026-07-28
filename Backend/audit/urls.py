from django.urls import path
from .views import list_logs

urlpatterns = [
    path('audit/logs/', list_logs, name='audit-logs'),
]