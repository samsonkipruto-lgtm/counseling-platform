from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.permissions import IsAdmin
from .models import AuditLog


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def list_logs(request):
    logs = AuditLog.objects.all().order_by('-timestamp')

    action = request.query_params.get('action')
    if action:
        logs = logs.filter(action=action)

    date_from = request.query_params.get('date_from')
    if date_from:
        logs = logs.filter(timestamp__gte=date_from)

    date_to = request.query_params.get('date_to')
    if date_to:
        logs = logs.filter(timestamp__lte=date_to)

    data = [{
        'id': log.id,
        'actor_role': log.actor_role,
        'actor_id': log.actor_id,
        'action': log.action,
        'target_alias': log.target_alias,
        'timestamp': log.timestamp,
        'ip_address': log.ip_address,
    } for log in logs]

    return Response(data, status=200)