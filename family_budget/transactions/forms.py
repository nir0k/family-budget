from django import forms
from .models import Transaction, Category


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
            # 'author',
            # 'date',
        )


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = (
            'title',
            'type',
        )
