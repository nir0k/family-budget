from rest_framework import serializers

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
