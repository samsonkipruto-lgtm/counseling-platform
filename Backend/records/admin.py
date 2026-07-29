from django.contrib import admin
from aliases.utils import decrypt
from .models import CounselingRecord


@admin.register(CounselingRecord)
class CounselingRecordAdmin(admin.ModelAdmin):
    # 1. LIST VIEW
    list_display = ('id', 'booking', 'counselor', 'get_decrypted_notes_preview', 'created_at', 'updated_at')
    list_display_links = ('id', 'booking')
    list_filter = ('counselor', 'created_at')
    search_fields = ('booking__id', 'counselor__email')
    ordering = ('-created_at',)
    
    # Prevents accidental edits from admin UI so records stay tied to the API flow
    readonly_fields = ('created_at', 'updated_at', 'get_decrypted_notes')

    # 2. FIELDSETS FOR DETAIL VIEW
    fieldsets = (
        ('Booking & Counselor Details', {
            'fields': ('booking', 'counselor')
        }),
        ('Decrypted Session Notes', {
            'fields': ('get_decrypted_notes',),
            'description': 'Decrypted automatically on display using stored IV.'
        }),
        ('Raw Encrypted Payload (Security)', {
            'classes': ('collapse',),  # Collapsible section
            'fields': ('notes_encrypted', 'encryption_iv')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    # Helper function to show a short snippet of decrypted notes in the list view
    @admin.display(description='Notes Preview')
    def get_decrypted_notes_preview(self, obj):
        try:
            decrypted = decrypt(obj.notes_encrypted, obj.encryption_iv)
            return decrypted[:50] + '...' if len(decrypted) > 50 else decrypted
        except Exception:
            return "[Decryption Error]"

    # Helper function to display the full decrypted text in detail view
    @admin.display(description='Decrypted Notes')
    def get_decrypted_notes(self, obj):
        try:
            return decrypt(obj.notes_encrypted, obj.encryption_iv)
        except Exception:
            return "[Decryption Error]"