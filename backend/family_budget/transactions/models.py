from django.db import models, transaction

from accounts.models import Account
from currency.convector import get_rate_for_date
from currency.models import Currency
from users.models import User

TRANSACTION_TYPE = [
    ('+', 'Income'),
    ('-', 'Expense'),
    ('=', 'Transfer'),
]


class Transaction_Type(models.Model):
    title = models.CharField(max_length=100)
    type = models.CharField(
        max_length=1,
        choices=TRANSACTION_TYPE,
        default='-',
        unique=True
    )

    class Meta:
        ordering = ['title']
        verbose_name = 'Type'

    def __str__(self):
        return self.title


class Category(models.Model):
    title = models.CharField(max_length=100, unique=True)
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
                             related_name='transaction_type',
                             on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE,
                                 db_index=True)
    who = models.ForeignKey(User,
                            verbose_name='Who',
                            related_name='who_expense',
                            on_delete=models.CASCADE,
                            db_index=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE,
                                db_index=True)
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    amount_converted = models.DecimalField(
        max_digits=20, decimal_places=2, blank=True, null=True)
    amount_converted_to = models.DecimalField(
        max_digits=20, decimal_places=2, blank=True, null=True)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE,
                                 db_index=True)
    description = models.CharField(max_length=256, blank=True, null=True)
    author = models.ForeignKey(User,
                               verbose_name='Author',
                               on_delete=models.CASCADE,
                               db_index=True)
    date = models.DateField()
    account_to = models.ForeignKey(
        Account,
        verbose_name='To Account',
        related_name='transfers_in',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        db_index=True
    )

    class Meta:
        ordering = ['-date']

    @transaction.atomic
    def save(self, *args, **kwargs):
        self.type = self.category.type
        converted_amount = self.convert_amount(
            amount=self.amount,
            from_currency=self.currency,
            to_currency=self.account.currency,
            date=self.date
        )
        self.amount_converted = converted_amount
        if self.type.title == 'Transfer':
            converted_amount_to = self.convert_amount(
                amount=converted_amount,
                from_currency=self.account.currency,
                to_currency=self.account_to.currency,
                date=self.date
            )
            self.amount_converted_to = converted_amount_to

        if self.pk:
            old_trans = Transaction.objects.get(pk=self.pk)
            if self.type.title == 'Income':
                self.account.balance -= old_trans.amount_converted
            elif self.type.title == 'Expense':
                self.account.balance += old_trans.amount_converted
            elif self.type.title == 'Transfer':
                if old_trans.account != self.account:
                    old_trans.account.balance += old_trans.amount_converted
                    old_trans.account.save()
                else:
                    self.account.balance += old_trans.amount_converted
                    self.account.save()
                if old_trans.account_to != self.account_to:
                    old_trans.account_to.balance -= (
                        old_trans.amount_converted_to)
                    old_trans.account_to.save()
                else:
                    self.account_to.balance -= old_trans.amount_converted_to
                    self.account.save()

        if self.type.title == 'Income':
            self.account.balance += converted_amount
            self.account.save()
        elif self.type.title == 'Expense':
            self.account.balance -= converted_amount
            self.account.save()
        elif self.type.title == 'Transfer':
            if self.account == self.account_to:
                raise ValueError(
                    'Both source and destination accounts must'
                    ' be specified and be different for a transfer.')
            if not self.account and not self.account_to:
                raise ValueError(
                    'Both source and destination accounts'
                    ' must be specified for a transfer.')
            self.account.balance -= converted_amount
            self.account.save()
            self.account_to.balance += converted_amount_to
            self.account_to.save()

        super().save(*args, **kwargs)

    @transaction.atomic
    def delete(self, *args, **kwargs):
        if self.type.title == 'Income':
            self.account.balance -= self.amount_converted
            self.account.save()
        elif self.type.title == 'Expense':
            self.account.balance += self.amount_converted
            self.account.save()
        elif self.type.title == 'Transfer':
            if self.account and self.account_to:
                self.account.balance += self.amount_converted
                self.account_to.balance -= self.amount_converted_to
                self.account.save()
                self.account_to.save()

        super().delete(*args, **kwargs)

    def convert_amount(self, amount, from_currency, to_currency, date):
        if from_currency == to_currency:
            return amount
        rate = get_rate_for_date(
            from_currency=from_currency,
            to_currency=to_currency,
            date=date
        )
        if rate:
            return amount * rate
        raise ValueError('Currency rate not fetch')

    def __str__(self):
        return self.title
