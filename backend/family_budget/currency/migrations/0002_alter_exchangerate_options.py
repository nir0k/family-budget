# Generated by Django 4.2.5 on 2023-12-17 09:37

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("currency", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="exchangerate",
            options={"ordering": ["-last_updated"]},
        ),
    ]
