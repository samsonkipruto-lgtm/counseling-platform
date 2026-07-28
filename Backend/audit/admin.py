from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'action', 'actor_role', 'actor_id', 'target_alias', 'timestamp', 'ip_address')
    list_filter = ('action', 'actor_role')
    ordering = ('-timestamp',)