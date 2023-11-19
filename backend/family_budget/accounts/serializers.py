from datetime import datetime, timedelta

from budget.models import Budget, Family
from currency.convector import get_rate_for_date
from django.db.models import Sum
from rest_framework import serializers
from transactions.models import Transaction, Transaction_Type

from .models import Account, Account_Type


def current_balance(obj) -> float:
    income = Transaction.objects.filter(
        who=obj.owner_id,
        account=obj,
        type__in=Transaction_Type.objects.filter(type="+")
    ).aggregate(Sum('amount'))["amount__sum"]

    expense = Transaction.objects.filter(
        who=obj.owner_id,
        account=obj,
        type__in=Transaction_Type.objects.filter(type="-")
    ).aggregate(Sum('amount'))["amount__sum"]

    return float(income or 0) - float(expense or 0)


class Account_TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account_Type
        fields = (
            'id',
            'title'
        )


class AccountSerializer(serializers.ModelSerializer):
    current_balance = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = (
            'id',
            'title',
            'type',
            'value',
            'currency',
            'created',
            'owner',
            'current_balance',
        )

    def get_current_balance(self, obj) -> float:
        return current_balance(obj)


class FamilyFinStateSerializer(serializers.ModelSerializer):
    current = serializers.SerializerMethodField()

    class Meta:
        model = Family
        fields = (
            'id',
            'title',
            'current',
        )

    def get_current(self, obj) -> float:
        members = obj.members.all()
        budget_currency = Budget.objects.get(family=obj).currency
        family_balance = 0
        for member in members:
            member_accounts = Account.objects.filter(owner=member)
            member_balance = 0
            for member_account in member_accounts:
                balance = current_balance(member_account)
                if member_account.currency != budget_currency:
                    rate = get_rate_for_date(
                        from_currency=budget_currency,
                        to_currency=member_account.currency,
                        date=datetime.now().date() - timedelta(days=1)
                    )
                    if rate is not None:
                        rate = float(rate)
                        balance = balance / rate
                    else:
                        # Handle the case where the rate is not found
                        pass
                member_balance += balance
            family_balance += member_balance
        return round(float(family_balance), 2)
