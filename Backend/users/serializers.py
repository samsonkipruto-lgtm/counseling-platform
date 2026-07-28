from rest_framework import serializers
from .models import User


class StudentRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    full_name = serializers.CharField(max_length=100)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            role='student',
            password=None,
        )
        user.set_unusable_password()
        user.save()
        return user

class CounselorRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    full_name = serializers.CharField(max_length=100)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            role='counselor',
            password=None,
        )
        user.full_name = validated_data['full_name']
        user.set_unusable_password()
        user.save()
        return user