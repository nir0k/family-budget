# Generated by Django 4.2.5 on 2023-11-22 22:49

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_account_balance"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="account",
            name="value",
        ),
    ]
