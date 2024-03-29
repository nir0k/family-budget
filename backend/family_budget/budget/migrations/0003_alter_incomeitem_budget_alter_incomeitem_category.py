# Generated by Django 4.2.5 on 2023-11-07 17:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("transactions", "0001_initial"),
        ("budget", "0002_remove_budget_user"),
    ]

    operations = [
        migrations.AlterField(
            model_name="incomeitem",
            name="budget",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="income_items",
                to="budget.budget",
            ),
        ),
        migrations.AlterField(
            model_name="incomeitem",
            name="category",
            field=models.ForeignKey(
                limit_choices_to={"type__type": "+"},
                on_delete=django.db.models.deletion.CASCADE,
                to="transactions.category",
            ),
        ),
    ]
