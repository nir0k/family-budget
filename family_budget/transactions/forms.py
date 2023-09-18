from django import forms
from .models import Transaction


class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = (
            # 'id',
            'title',
            'type',
            'category',
            'who',
            'account',
            'amount',
            'description',
            'author',
            # 'date',
        )
