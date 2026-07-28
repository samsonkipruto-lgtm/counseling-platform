from django.contrib import admin
from .models import AliasMapping


@admin.register(AliasMapping)
class AliasMappingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "alias_code",
        "student",
        "created_at",
    )

    search_fields = (
        "alias_code",
        "student__phone_number",
    )

    ordering = ("id",)