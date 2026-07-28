from django.db import models


# audit/models.py
class AuditLog(models.Model):
    actor_role = models.CharField(max_length=15)
    actor_id = models.IntegerField(null=True, blank=True)
    action = models.CharField(max_length=30)
    target_alias = models.CharField(max_length=255, blank=True, default='')  # widened
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.action} by {self.actor_role} ({self.actor_id}) at {self.timestamp}"