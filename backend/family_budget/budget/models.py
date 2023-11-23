from django.core.exceptions import ValidationError
from django.db import models

from currency.models import Currency
from transactions.models import Category, Transaction_Type
from users.models import User


class Family(models.Model):
    title = models.CharField(max_length=150)
    members = models.ManyToManyField(User, related_name="families")

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class Budget(models.Model):
    title = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    family = models.ForeignKey(Family, on_delete=models.CASCADE)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        is_new = not self.pk
        super(Budget, self).save(*args, **kwargs)

        if is_new:
            expensetype = Transaction_Type.objects.get(type='-')
            incometype = Transaction_Type.objects.get(type='+')
            for category in Category.objects.filter(type=expensetype):
                ExpenseItem.objects.create(
                    category=category, budget=self, amount=0)
            for category in Category.objects.filter(type=incometype):
                IncomeItem.objects.create(
                    category=category, budget=self, amount=0)

        overlapping_budgets = Budget.objects.filter(
            family=self.family,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date
        ).exclude(pk=self.pk)

        if overlapping_budgets.exists():
            raise ValidationError(
                'There is an overlapping budget in '
                'the given time range for this family.')

    def __str__(self):
        return f'{self.start_date} - {self.end_date}'


class ExpenseItem(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        limit_choices_to={'type__type': '-'},
    )
    budget = models.ForeignKey(Budget,
                               on_delete=models.CASCADE,
                               related_name="expense_items")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.category.title

    class Meta:
        unique_together = ['category', 'budget']


class IncomeItem(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        limit_choices_to={'type__type': '+'}
    )
    budget = models.ForeignKey(
        Budget,
        on_delete=models.CASCADE,
        related_name="income_items"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.category.title

    class Meta:
        unique_together = ['category', 'budget']
