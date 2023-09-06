from django.db import models

from users.models import User
from accounts.models import Account


class Transaction_Type(models.Model):
    title = models.CharField(max_length=100)

    class Meta:
        ordering = ["title"]
        verbose_name = "Type"

    def __str__(self):
        return self.title


class Category(models.Model):
    title = models.CharField(max_length=100)
    type = models.ForeignKey(Transaction_Type,
                             verbose_name='Type',
                             on_delete=models.CASCADE)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title


class Transaction(models.Model):
    title = models.CharField(max_length=100)
    type = models.ForeignKey(Transaction_Type, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    who = models.ForeignKey(User,
                            verbose_name='Who',
                            related_name='who_expense',
                            on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.CharField(max_length=256)
    author = models.ForeignKey(User,
                               verbose_name='Author',
                               on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return self.title
