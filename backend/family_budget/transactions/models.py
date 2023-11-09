from django.db import models

from accounts.models import Account
from currency.models import Currency
from users.models import User

TRANSACTION_TYPE = [
    ('+', 'Income'),
    ('-', 'Expense')
]


class Transaction_Type(models.Model):
    title = models.CharField(max_length=100)
    type = models.CharField(
        max_length=1,
        choices=TRANSACTION_TYPE,
        default='-',
    )

    class Meta:
        ordering = ['title']
        verbose_name = 'Type'

    def __str__(self):
        return self.title


class Category(models.Model):
    title = models.CharField(max_length=100)
    type = models.ForeignKey(Transaction_Type,
                             verbose_name='Type',
                             on_delete=models.CASCADE)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class Transaction(models.Model):
    title = models.CharField(max_length=100)
    type = models.ForeignKey(Transaction_Type,
                             related_name="transaction_type",
                             on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    who = models.ForeignKey(User,
                            verbose_name='Who',
                            related_name='who_expense',
                            on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    description = models.CharField(max_length=256, blank=True, null=True)
    author = models.ForeignKey(User,
                               verbose_name='Author',
                               on_delete=models.CASCADE)
    date = models.DateField()

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title
