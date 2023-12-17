from datetime import datetime, timedelta

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum
from django.http import Http404
from rest_framework import serializers

from budget.models import Budget, Family
from currency.convector import get_rate_for_date
from currency.models import Currency
from transactions.models import Transaction, Transaction_Type
from users.models import User

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

    return (float(obj.value or 0) + float(income or 0) - float(expense or 0))


class Account_TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account_Type
        fields = (
            'id',
            'title'
        )


class AccountSerializer(serializers.ModelSerializer):
    owner = serializers.SlugRelatedField(
        queryset=User.objects.all(), slug_field='username')
    type = serializers.SlugRelatedField(
        queryset=Account_Type.objects.all(), slug_field='title')
    currency = serializers.SlugRelatedField(
        queryset=Currency.objects.all(), slug_field='code')

    class Meta:
        model = Account
        fields = (
            'id',
            'title',
            'type',
            'currency',
            'created',
            'owner',
            'balance',
        )


class FamilyFinStateSerializer(serializers.ModelSerializer):
    current = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Family
        fields = (
            'id',
            'title',
            'current',
            'currency'
        )

    def get_current(self, obj) -> float:
        members = obj.members.all()
        try:
            currency = Budget.objects.get(family=obj).currency
        except ObjectDoesNotExist:
            fallback_currency = Currency.objects.first()
            if fallback_currency is not None:
                currency = fallback_currency
            else:
                return 0.0

        family_balance = 0
        for member in members:
            member_accounts = Account.objects.filter(owner=member)
            member_balance = 0
            for member_account in member_accounts:
                balance = member_account.balance
                if member_account.currency != currency:
                    rate = get_rate_for_date(
                        from_currency=currency,
                        to_currency=member_account.currency,
                        date=datetime.now().date() - timedelta(days=1)
                    )
                    if rate is not None:
                        rate = rate
                        balance = balance / rate
                    else:
                        # Handle the case where the rate is not found
                        pass
                member_balance += balance
            family_balance += member_balance
        return round(float(family_balance), 2)

    def get_currency(self, obj) -> str:
        try:
            currency = Budget.objects.get(family=obj).currency
        except ObjectDoesNotExist:
            fallback_currency = Currency.objects.first()
            if fallback_currency is not None:
                currency = fallback_currency
            else:
                raise Http404("Currency does not exist")
        return currency.code
