from rest_framework import viewsets
from .models import Transaction, Transaction_Type, Category
from .serializers import (
    TransactionSerializer,
    Transaction_TypeSerializer,
    CategorySerializer
)
from users.permissions import IsAdmin, IsUser
from rest_condition import Or


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = (Or(IsUser, IsAdmin),)


class Transaction_TypeViewSet(viewsets.ModelViewSet):
    queryset = Transaction_Type.objects.all()
    serializer_class = Transaction_TypeSerializer
    permission_classes = (Or(IsUser, IsAdmin),)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (Or(IsUser, IsAdmin),)
