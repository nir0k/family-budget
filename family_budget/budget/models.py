from django.db import models
from transactions.models import Category


class Budget(models.Model):
    title = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)


class ExpenseItem(models.Model):
    description = models.CharField(max_length=255, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    budget = models.ForeignKey(Budget,
                               on_delete=models.CASCADE,
                               related_name="expense_items")
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.description

    class Meta:
        unique_together = ['category', 'budget']
