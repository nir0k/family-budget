# Generated by Django 4.2.5 on 2023-10-22 18:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("transactions", "0006_alter_transaction_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transaction",
            name="date",
            field=models.DateField(),
        ),
    ]
