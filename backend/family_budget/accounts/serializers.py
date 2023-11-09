from django.db.models import Sum
from rest_framework import serializers
from transactions.models import Transaction, Transaction_Type

from .models import Account, Account_Type


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
