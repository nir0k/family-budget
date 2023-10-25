from rest_framework import serializers

from .models import Transaction, Transaction_Type, Category
from users.models import User
from accounts.models import Account


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
        representation['type'] = Transaction_Type.objects.get(
            id=representation['type']).title
        return representation

    class Meta:
        model = Category
        fields = (
            'id',
            'title',
            'type',
        )


class TransactionSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['type'] = Transaction_Type.objects.get(
            id=representation['type']).title
        representation['category'] = Category.objects.get(
            id=representation['category']).title
        representation['account'] = Account.objects.get(
            id=representation['account']).title
        representation['who'] = User.objects.get(
            id=representation['who']).username
        representation['author'] = User.objects.get(
            id=representation['author']).username
        return representation

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
            'description',
            'author',
            'date',
        )
        read_only_fields = ('author',)
