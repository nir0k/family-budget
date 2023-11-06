from rest_framework import serializers

from .models import Transaction, Transaction_Type, Category
# from currency.models import Currency
# from currency.convector import update_rates_for_date, get_rate_for_date


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

    # def create(self, validated_data):
    #     currency = validated_data['currency']
    #     if currency.code != 'HUF':
    #         update_rates_for_date(validated_data['date'])
    #         huf_currency = Currency.objects.get(code='HUF')
    #         converted_amount = get_rate_for_date(
    #             validated_data['amount'], huf_currency, currency)
    #         validated_data['amount'] = converted_amount
    #     return super().create(validated_data)
