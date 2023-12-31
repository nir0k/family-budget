from rest_framework import serializers

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

    class Meta:
        model = Category
        fields = (
            'id',
            'title',
            'type',
        )


class CategoryField(serializers.RelatedField):
    def to_representation(self, value):
        return value.title

    def to_internal_value(self, data):
        transaction_type = self.context.get('request').data.get('type')
        category = Category.objects.filter(
            title=data,
            type__title=transaction_type
        ).first()
        if not category:
            raise serializers.ValidationError(
                f"Category with title '{data}' and"
                " specified type does not exist.")
        return category


class TransactionSerializer(serializers.ModelSerializer):
    who = serializers.SlugRelatedField(
        queryset=User.objects.all(), slug_field='username')
    category = CategoryField(queryset=Category.objects.all())
    type = serializers.SlugRelatedField(
        queryset=Transaction_Type.objects.all(), slug_field='title')
    author = serializers.SlugRelatedField(
        read_only=True, slug_field='username')
    currency = serializers.SlugRelatedField(
        read_only=True,
        slug_field='code'
    )

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
        read_only_fields = ('author', 'type', 'currency')

    def validate(self, data):
        """
        Check that the account is set and get currency from it.
        """
        account = data.get('account')
        if account and 'currency' not in data:
            data['currency'] = account.currency
        return data
