from rest_framework import serializers
from .models import AliasMapping


class AliasSerializer(serializers.ModelSerializer):
    class Meta:
        model = AliasMapping
        fields = ['alias_code']