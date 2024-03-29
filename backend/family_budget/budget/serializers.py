from decimal import ROUND_HALF_UP, Decimal

from django.db import models
from rest_framework import serializers

from currency.convector import get_rate_for_date
from transactions.models import Category, Transaction, Transaction_Type

from .models import Budget, ExpenseItem, Family, IncomeItem


class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = (
            'id',
            'title',
            'members',
        )


class IncomeItemSerializer(serializers.ModelSerializer):
    budget = serializers.StringRelatedField()
    income = serializers.SerializerMethodField()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['category'] = Category.objects.get(
            id=representation['category']).title
        return representation

    class Meta:
        model = IncomeItem
        fields = (
            'id',
            'description',
            'category',
            'budget',
            'amount',
            'income',
        )

    def get_income(self, obj) -> float:
        budget_currency = obj.budget.currency
        family = obj.budget.family
        family_members = family.members.all()
        expenses = Transaction.objects.filter(
            who__in=family_members,
            type__in=Transaction_Type.objects.filter(type="+"),
            category=obj.category,
            date__gte=obj.budget.start_date,
            date__lte=obj.budget.end_date
        )

        total_expense_in_huf = Decimal(0)

        for expense in expenses:
            if expense.currency != budget_currency:
                rate = get_rate_for_date(
                    from_currency=budget_currency,
                    to_currency=expense.currency,
                    date=expense.date
                )
                if rate is not None:
                    rate = Decimal(rate)
                    total_expense_in_huf += expense.amount / rate
                else:
                    # Handle the case where the rate is not found
                    pass
            else:
                total_expense_in_huf += expense.amount

        result = total_expense_in_huf.quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP)
        return float(result)


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
        budget_currency = obj.budget.currency
        family = obj.budget.family
        family_members = family.members.all()
        expenses = Transaction.objects.filter(
            who__in=family_members,
            type__in=Transaction_Type.objects.filter(type="-"),
            category=obj.category,
            date__gte=obj.budget.start_date,
            date__lte=obj.budget.end_date
        )

        total_expense_in_huf = Decimal(0)

        for expense in expenses:
            if expense.currency != budget_currency:
                rate = get_rate_for_date(
                    from_currency=budget_currency,
                    to_currency=expense.currency,
                    date=expense.date
                )
                if rate is not None:
                    rate = Decimal(rate)
                    total_expense_in_huf += expense.amount / rate
                else:
                    # Handle the case where the rate is not found
                    pass
            else:
                total_expense_in_huf += expense.amount

        result = total_expense_in_huf.quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP)
        return float(result)


class BudgetSerializer(serializers.ModelSerializer):
    expense_items = ExpenseItemSerializer(many=True, required=False)
    income_items = IncomeItemSerializer(many=True, required=False)
    total_expense = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    currency = serializers.StringRelatedField()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['family'] = Family.objects.get(
            id=representation['family']).title
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
            'income_items',
            'total_expense',
            'total_amount',
            'family',
            'currency',
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
