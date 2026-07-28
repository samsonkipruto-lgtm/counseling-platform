from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/otp/', include('otp.urls')),
    path('api/users/', include('users.urls')),
    path('api/', include('aliases.urls')),
    path('api/', include('bookings.urls')),
    path('api/', include('records.urls')),
    path('api/', include('audit.urls')),
]