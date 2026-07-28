from django.contrib import admin
from .models import OTPLog


@admin.register(OTPLog)
class OTPLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "email",
        "used",
        "attempt_count",
        "issued_at",
        "expires_at",
    )

    search_fields = ("email",)
    ordering = ("-issued_at",)