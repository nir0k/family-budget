from rest_framework import serializers
from .models import Budget, ExpenseItem


class ExpenseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseItem
        fields = (
            'id',
            'description',
            'category',
            'budget',
            'amount',
        )


class BudgetSerializer(serializers.ModelSerializer):
    expense_items = ExpenseItemSerializer(many=True, required=False)

    class Meta:
        model = Budget
        fields = (
            'id',
            'title',
            'start_date',
            'end_date',
            'total_budget',
            'expense_items'
        )
