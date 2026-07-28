from rest_framework import serializers
from aliases.utils import decrypt
from .models import Booking, SessionSlot
from .utils import check_identity_reveal


class SessionSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionSlot
        fields = ['id', 'slot_datetime', 'is_available']


class StudentBookingSerializer(serializers.ModelSerializer):
    alias_code = serializers.CharField(source='alias.alias_code', read_only=True)
    slot_datetime = serializers.DateTimeField(source='slot.slot_datetime', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'alias_code', 'slot_datetime', 'status', 'booked_at']


class CounselorQueueSerializer(serializers.ModelSerializer):
    alias_code = serializers.CharField(source='alias.alias_code', read_only=True)
    slot_datetime = serializers.DateTimeField(source='slot.slot_datetime', read_only=True)
    real_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'alias_code', 'slot_datetime', 'status', 'booked_at', 'real_name']

    def get_real_name(self, obj):
        if check_identity_reveal(obj):
            mapping = obj.alias
            return decrypt(mapping.real_name_encrypted, mapping.encryption_iv)
        return None