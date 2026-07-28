from django.conf import settings
from django.db import models


class AliasMapping(models.Model):
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='alias_mapping')
    alias_code = models.CharField(max_length=30, unique=True)
    real_name_encrypted = models.TextField()
    real_email_encrypted = models.TextField(blank=True, default='')
    encryption_iv = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.alias_code