from rest_framework import viewsets

from .models import Account_Type, Account
from .serializers import (
    Account_TypeSerializer,
    AccountSerializer,
)


class Account_TypeViewSet(viewsets.ModelViewSet):
    queryset = Account_Type.objects.all()
    serializer_class = Account_TypeSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    pagination_class = None
