from django.db import models
from transactions.models import Category
from django.core.exceptions import ValidationError
from users.models import User


class Budget(models.Model):
    title = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        overlapping_budgets = Budget.objects.filter(
            user=self.user,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date
        )

        if self.pk:
            overlapping_budgets = overlapping_budgets.exclude(pk=self.pk)

        if overlapping_budgets.exists():
            raise ValidationError(
                'There is an overlapping budget in the given time range.')

        super(Budget, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.start_date} - {self.end_date}'


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
