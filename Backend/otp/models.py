from django.db import models


class OTPLog(models.Model):
    email = models.EmailField()
    otp_hash = models.CharField(max_length=128)
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    attempt_count = models.IntegerField(default=0)

    def __str__(self):
        return f"OTP for {self.email} (used={self.used})"