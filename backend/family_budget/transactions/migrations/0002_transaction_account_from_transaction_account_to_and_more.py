# Generated by Django 4.2.5 on 2023-11-21 19:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_account_balance"),
        ("transactions", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="transaction",
            name="account_from",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="transfers_out",
                to="accounts.account",
                verbose_name="From Account",
            ),
        ),
        migrations.AddField(
            model_name="transaction",
            name="account_to",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="transfers_in",
                to="accounts.account",
                verbose_name="To Account",
            ),
        ),
        migrations.AlterField(
            model_name="transaction_type",
            name="type",
            field=models.CharField(
                choices=[("+", "Income"), ("-", "Expense"), ("=", "Transfer")],
                default="-",
                max_length=1,
            ),
        ),
    ]