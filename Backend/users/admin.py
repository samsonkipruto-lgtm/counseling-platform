from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'role', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff')
    ordering = ('date_joined',)
    search_fields = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Role & Status', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Permissions', {'fields': ('groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'role', 'password1', 'password2'),
        }),
    )
    filter_horizontal = ('groups', 'user_permissions')


admin.site.register(User, UserAdmin)