from rest_condition import Or
from rest_framework import viewsets

from users.permissions import IsAdmin, IsAuth, IsUser

from .filters import CategoryFilter
from .models import Category, Transaction, Transaction_Type
from .serializers import (CategorySerializer, Transaction_TypeSerializer,
                          TransactionSerializer)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = (Or(IsUser, IsAdmin),)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class Transaction_TypeViewSet(viewsets.ModelViewSet):
    queryset = Transaction_Type.objects.all()
    serializer_class = Transaction_TypeSerializer
    permission_classes = (Or(IsUser, IsAdmin),)
    pagination_class = None


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None
    permission_classes = (IsAuth,)
    filterset_class = CategoryFilter
