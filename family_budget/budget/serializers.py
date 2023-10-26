from rest_framework import serializers
from .models import Budget, ExpenseItem
from users.models import User
from transactions.models import Category, Transaction, Transaction_Type
from django.db.models import Sum
from django.db import models


class ExpenseItemSerializer(serializers.ModelSerializer):
    budget = serializers.StringRelatedField()
    expense = serializers.SerializerMethodField()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['category'] = Category.objects.get(
            id=representation['category']).title
        return representation

    class Meta:
        model = ExpenseItem
        fields = (
            'id',
            'description',
            'category',
            'budget',
            'amount',
            'expense',
        )

    def get_expense(self, obj) -> float:
        expense = Transaction.objects.filter(
            who=self.context['request'].user,
            type__in=Transaction_Type.objects.filter(type="-"),
            category=obj.category,
            date__gte=obj.budget.start_date,
            date__lte=obj.budget.end_date
        ).aggregate(Sum('amount'))["amount__sum"]
        return float(expense or 0)


class BudgetSerializer(serializers.ModelSerializer):
    expense_items = ExpenseItemSerializer(many=True, required=False)
    total_expense = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField() 

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = User.objects.get(
            id=representation['user']).username
        return representation

    class Meta:
        model = Budget
        fields = (
            'id',
            'title',
            'start_date',
            'end_date',
            'total_budget',
            'expense_items',
            'user',
            'total_expense',
            'total_amount',
        )
        read_only_fields = ('user',)

    def validate(self, data):
        user = self.context['request'].user
        start_date = data['start_date']
        end_date = data['end_date']

        overlapping_budgets = Budget.objects.filter(
            user=user,
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        if self.instance:
            overlapping_budgets = overlapping_budgets.exclude(
                pk=self.instance.pk)

        if overlapping_budgets.exists():
            raise serializers.ValidationError(
                'There is an overlapping budget in the given time range.')

        return data

    def get_total_expense(self, obj):
        expenses = [
            self.fields['expense_items'].child.get_expense(item)
            for item in obj.expense_items.all()
        ]
        return sum(expenses)

    def get_total_amount(self, obj):
        total_amount = obj.expense_items.aggregate(
            total=models.Sum('amount'))['total']
        return float(total_amount or 0)
