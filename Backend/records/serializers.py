from rest_framework import serializers
from .models import CounselingRecord


class RecordCreateSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    notes = serializers.CharField()


class RecordUpdateSerializer(serializers.Serializer):
    notes = serializers.CharField()


class RecordDisplaySerializer(serializers.ModelSerializer):
    notes = serializers.SerializerMethodField()

    class Meta:
        model = CounselingRecord
        fields = ['id', 'booking', 'counselor', 'notes', 'created_at', 'updated_at']

    def get_notes(self, obj):
        from aliases.utils import decrypt
        return decrypt(obj.notes_encrypted, obj.encryption_iv)