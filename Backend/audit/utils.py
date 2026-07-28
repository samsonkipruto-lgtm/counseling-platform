from .models import AuditLog


def get_client_ip(request):
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def log_event(actor, action, alias='', request=None):
    """
    actor: the User instance performing the action (can be None for anonymous, e.g. OTP request)
    action: string like 'LOGIN', 'BOOK', 'REVEAL', 'RECORD_CREATE', etc.
    alias: alias_code string, if applicable
    request: the DRF request object, used to extract IP
    """
    AuditLog.objects.create(
        actor_role=actor.role if actor else 'anonymous',
        actor_id=actor.id if actor else None,
        action=action,
        target_alias=alias or '',
        ip_address=get_client_ip(request) if request else None,
    )