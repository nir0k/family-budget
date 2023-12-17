from rest_framework import serializers

from .models import Currency, ExchangeRate


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = (
            'id',
            'title',
            'code',
        )


class ExchangeRateSerializer(serializers.ModelSerializer):
    from_currency = serializers.SlugRelatedField(
        queryset=Currency.objects.all(), slug_field='code')
    to_currency = serializers.SlugRelatedField(
        queryset=Currency.objects.all(), slug_field='code')

    class Meta:
        model = ExchangeRate
        fields = (
            'id',
            'from_currency',
            'to_currency',
            'rate',
            'rate_date',
            'last_updated'
        )
        read_only_fields = ('last_updated',)
