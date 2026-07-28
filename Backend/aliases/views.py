from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.permissions import IsCounselor, IsStudent
from .models import AliasMapping


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def get_my_alias(request):
    try:
        mapping = AliasMapping.objects.get(student=request.user)
    except AliasMapping.DoesNotExist:
        return Response({'error': 'No alias found for this account'}, status=404)

    return Response({'alias': mapping.alias_code}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsCounselor])
def reveal_identity(request, booking_id):
    # Stub — the real 24h-reveal logic needs the Booking model, which doesn't exist
    # until Phase 3 (bookings app). This will be completed then.
    return Response({'error': 'Not implemented yet — requires bookings app (Phase 3)'}, status=501)