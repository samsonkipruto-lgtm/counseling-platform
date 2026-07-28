import random
import bcrypt
import requests
from django.utils import timezone
from datetime import timedelta
from decouple import config

from .models import OTPLog


def generate_otp():
    return str(random.randint(100000, 999999))


def hash_otp(otp):
    return bcrypt.hashpw(otp.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def check_otp_hash(otp, otp_hash):
    return bcrypt.checkpw(otp.encode('utf-8'), otp_hash.encode('utf-8'))


def send_otp_email(email, otp):
    response = requests.post(
        'https://api.brevo.com/v3/smtp/email',
        headers={
            'api-key': config('BREVO_API_KEY'),
            'Content-Type': 'application/json',
        },
        json={
            'sender': {'email': config('DEFAULT_FROM_EMAIL')},
            'to': [{'email': email}],
            'subject': 'Your verification code',
            'htmlContent': f'<p>Your verification code is <strong>{otp}</strong>. It expires in 5 minutes.</p>',
        },
    )
    response.raise_for_status()


def create_and_send_otp(email):
    otp = generate_otp()
    otp_hash = hash_otp(otp)
    expires_at = timezone.now() + timedelta(minutes=5)

    OTPLog.objects.create(
        email=email,
        otp_hash=otp_hash,
        expires_at=expires_at,
    )
    send_otp_email(email, otp)


def verify_otp(email, submitted_otp):
    otp_log = OTPLog.objects.filter(
        email=email, used=False
    ).order_by('-issued_at').first()

    if not otp_log:
        return False

    if timezone.now() > otp_log.expires_at:
        return False

    otp_log.attempt_count += 1
    otp_log.save()

    if otp_log.attempt_count > 5:
        return False

    if check_otp_hash(submitted_otp, otp_log.otp_hash):
        otp_log.used = True
        otp_log.save()
        return True

    return False


def check_rate_limit(email):
    one_hour_ago = timezone.now() - timedelta(hours=1)
    recent_count = OTPLog.objects.filter(
        email=email, issued_at__gte=one_hour_ago
    ).count()
    return recent_count < 3