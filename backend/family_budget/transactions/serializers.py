from rest_framework import serializers

from .models import Category, Transaction, Transaction_Type


class Transaction_TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction_Type
        fields = (
            'id',
            'title',
        )


class CategorySerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation

    class Meta:
        model = Category
        fields = (
            'id',
            'title',
            'type',
        )


class TransactionSerializer(serializers.ModelSerializer):
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
        )
        read_only_fields = ('author',)
