from django import forms
from .models import Budget, ExpenseItem


class BudgetForm(forms.ModelForm):
    class Meta:
        model = Budget
        fields = ['title', 'start_date', 'end_date', 'total_budget']


class ExpenseItemForm(forms.ModelForm):
    class Meta:
        model = ExpenseItem
        fields = ['description', 'category', 'amount']
