# Generated by Django 4.2.5 on 2023-10-22 17:43

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ("transactions", "0005_alter_transaction_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transaction",
            name="date",
            field=models.DateField(db_index=True, default=django.utils.timezone.now),
        ),
    ]