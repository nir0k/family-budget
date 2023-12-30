import uuid
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
    title = models.CharField(max_length=100)
    type = models.ForeignKey(Transaction_Type,
                             verbose_name='Type',
                             on_delete=models.CASCADE)

    class Meta:
        ordering = ['title']
        unique_together = (('title', 'type'),)

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
    isTransfer = models.BooleanField(default=False)
    transfer_group_id = models.UUIDField(default=uuid.uuid4, editable=False)

    class Meta:
        ordering = ['-date']

    @transaction.atomic
    def save(self, *args, **kwargs):
        handle_related = kwargs.pop('handle_related', True)
        is_new = not self.pk
        was_transfer = False

        if is_new and self.type.type == "=":
            self.isTransfer = True
            title = (
                f'from {self.account.owner.username}-{self.account.title} '
                f'to {self.account_to.owner.username}-{self.account_to.title}'
            )
            transfer_group_id = (
                self.transfer_group_id
                if self.transfer_group_id else uuid.uuid4())

            Transaction(
                title=title,
                type=Transaction_Type.objects.get(type="-"),
                category=Category.objects.get(type__type="-",
                                              title="Transfer"),
                who=self.who,
                account=self.account,
                amount=self.amount,
                currency=self.account.currency,
                description=self.description,
                author=self.author,
                date=self.date,
                account_to=self.account_to,
                isTransfer=True,
                transfer_group_id=transfer_group_id,
            ).save()

            Transaction(
                title=title,
                type=Transaction_Type.objects.get(type="+"),
                category=Category.objects.get(type__type="+",
                                              title="Transfer"),
                who=self.account_to.owner,
                account=self.account_to,
                amount=self.amount,
                currency=self.account.currency,
                description=self.description,
                author=self.author,
                date=self.date,
                account_to=self.account,
                isTransfer=True,
                transfer_group_id=transfer_group_id,
            ).save()
            return

        if not is_new and handle_related:
            old_instance = Transaction.objects.get(pk=self.pk)
            was_transfer = (old_instance.isTransfer
                            and old_instance.transfer_group_id)
            account_to_changed = (old_instance.account_to != self.account_to
                                  or old_instance.account != self.account)

        if not is_new and was_transfer:
            if self.isTransfer and self.transfer_group_id:
                related_transactions = Transaction.objects.filter(
                    transfer_group_id=self.transfer_group_id
                ).exclude(pk=self.pk)
                changed_fields = {
                    field.name: getattr(self, field.name)
                    for field in self._meta.fields
                    if getattr(old_instance, field.name)
                    != getattr(self, field.name)
                }

                for trans in related_transactions:
                    for field_name, value in changed_fields.items():
                        if (field_name == 'amount'
                                and self.type.title != trans.type.title):
                            value = value
                        setattr(trans, field_name, value)
                    trans.amount_converted = self.convert_amount(
                        amount=trans.amount,
                        from_currency=trans.currency,
                        to_currency=trans.account.currency,
                        date=trans.date
                    )
                    fields_to_update = (
                        list(changed_fields.keys()) + ['amount_converted',])
                    if account_to_changed:
                        fields_to_update = (
                            list(changed_fields.keys()) + [
                                'account', 'amount_converted', 'currency'])
                        trans.account_to = self.account
                        trans.account = self.account_to
                        if trans.type.type == "-":
                            trans.currency = trans.account.currency
                        trans.amount_converted = self.convert_amount(
                            amount=trans.amount,
                            from_currency=trans.currency,
                            to_currency=trans.account.currency,
                            date=trans.date
                        )
                    trans.save(handle_related=False,
                               update_fields=fields_to_update)
                if self.type.type == "+":
                    self.currency = self.account_to.currency

        if self.pk:
            oldTrans = Transaction.objects.get(pk=self.pk)
            oldAmount = oldTrans.amount_converted
            if oldTrans.type.title == "Income":
                oldAmount *= -1
            oldTrans.account.balance += oldAmount
            oldTrans.account.save()

        self.type = self.category.type
        self.account.refresh_from_db()
        self.amount_converted = self.convert_amount(
            amount=self.amount,
            from_currency=self.currency,
            to_currency=self.account.currency,
            date=self.date
        )
        amount = self.amount_converted
        if self.type.title == 'Expense':
            amount *= -1
        self.account.balance += amount
        self.account.save()

        super().save(*args, **kwargs)

    @transaction.atomic
    def delete(self, *args, **kwargs):
        handle_related = kwargs.pop('handle_related', True)
        if handle_related:
            amount = self.amount_converted
            if self.category.type.type == "+":
                amount *= -1
            self.account.balance += amount
            self.account.save()

        if self.isTransfer and self.transfer_group_id and handle_related:
            related_transactions = Transaction.objects.filter(
                transfer_group_id=self.transfer_group_id
            ).exclude(pk=self.pk)

            for trans in related_transactions:
                if trans.category.type.type == "+":
                    trans.account.balance -= trans.amount_converted
                else:
                    trans.account.balance += trans.amount_converted
                trans.account.save()

                trans.delete(handle_related=False)

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
