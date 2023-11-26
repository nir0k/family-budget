from rest_framework import serializers

from budget.serializers import FamilySerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'password',
            'first_name',
            'last_name',
            'email',
            'role',
        )
        extra_kwargs = {
            'password': {
                'write_only': True,
                'required': True
            },
        }

    def update(self, instance, validated_data):
        validated_data.pop('role', None)
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class ProfileSerializers(serializers.ModelSerializer):
    family = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'role',
            'family'
        )

    def get_family(self, user):
        family = user.families.first()
        if family:
            return FamilySerializer(family).data
        return None
