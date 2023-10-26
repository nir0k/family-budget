from .models import Budget, ExpenseItem
from rest_framework import viewsets
from .serializers import (
    BudgetSerializer,
    ExpenseItemSerializer,
)
from users.permissions import IsUser


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsUser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)


class ExpenseItemViewSet(viewsets.ModelViewSet):
    queryset = ExpenseItem.objects.all()
    serializer_class = ExpenseItemSerializer
    permission_classes = [IsUser]
