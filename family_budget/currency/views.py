from rest_framework import viewsets
from .models import Currency, ExchangeRate
from .serializers import CurrencySerializer, ExchangeRateSerializer


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    pagination_class = None


class ExchangeRateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer
    pagination_class = None
