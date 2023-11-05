from .models import Budget, ExpenseItem, Family, IncomeItem
from rest_framework import viewsets
from .serializers import (
    BudgetSerializer,
    ExpenseItemSerializer,
    FamilySerializer,
    IncometemSerializer
)
from users.permissions import IsUser


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsUser]

    def perform_create(self, serializer):
        family = Family.objects.get(members=self.request.user)
        serializer.save(family=family)

    def get_queryset(self):
        family = Family.objects.get(members=self.request.user)
        return Budget.objects.filter(family=family)


class ExpenseItemViewSet(viewsets.ModelViewSet):
    queryset = ExpenseItem.objects.all()
    serializer_class = ExpenseItemSerializer
    permission_classes = [IsUser]


class IncomeItemViewSet(viewsets.ModelViewSet):
    queryset = IncomeItem.objects.all()
    serializer_class = IncometemSerializer
    permission_classes = [IsUser]


class FamilyViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer
    permission_classes = [IsUser]
