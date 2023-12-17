from rest_framework import serializers

from currency.models import Currency
from users.models import User

from .models import Category, Transaction, Transaction_Type


class Transaction_TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction_Type
        fields = (
            'id',
            'title',
        )


class CategorySerializer(serializers.ModelSerializer):
    type = serializers.SlugRelatedField(
        queryset=Transaction_Type.objects.all(), slug_field='title'
    )

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     return representation

    class Meta:
        model = Category
        fields = (
            'id',
            'title',
            'type',
        )


class TransactionSerializer(serializers.ModelSerializer):
    currency = serializers.SlugRelatedField(
        queryset=Currency.objects.all(), slug_field='code')
    who = serializers.SlugRelatedField(
        queryset=User.objects.all(), slug_field='username')
    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(), slug_field='title')
    type = serializers.SlugRelatedField(
        queryset=Transaction_Type.objects.all(), slug_field='title')
    author = serializers.SlugRelatedField(
        queryset=User.objects.all(), slug_field='username')

    class Meta:
        model = Transaction
        fields = (
            'id',
            'title',
            'type',
            'category',
            'who',
            'account',
            'amount',
            'currency',
            'description',
            'author',
            'date',
            'account_to',
        )
        read_only_fields = ('author', 'type')
