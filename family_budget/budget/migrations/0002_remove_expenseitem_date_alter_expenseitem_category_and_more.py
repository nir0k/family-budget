# Generated by Django 4.2.5 on 2023-10-18 16:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("transactions", "0004_alter_transaction_type"),
        ("budget", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="expenseitem",
            name="date",
        ),
        migrations.AlterField(
            model_name="expenseitem",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="transactions.category"
            ),
        ),
        migrations.DeleteModel(
            name="ExpenseCategory",
        ),
    ]