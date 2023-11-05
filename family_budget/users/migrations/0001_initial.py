# Generated by Django 4.2.5 on 2023-10-31 18:57

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        max_length=150,
                        unique=True,
                        validators=[
                            django.core.validators.RegexValidator(
                                code="invalid_username",
                                message="Username must be Alphanumeric",
                                regex="^(?!^me$)[\\w.@+-]+$",
                            )
                        ],
                        verbose_name="user",
                    ),
                ),
                ("first_name", models.CharField(blank=True, max_length=150, null=True)),
                ("last_name", models.CharField(blank=True, max_length=150, null=True)),
                ("is_active", models.BooleanField(default=True)),
                ("is_admin", models.BooleanField(default=False)),
                ("is_superuser", models.BooleanField(default=False)),
                (
                    "email",
                    models.EmailField(
                        max_length=254, unique=True, verbose_name="email address"
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        blank=True,
                        choices=[("admin", "admin"), ("user", "user")],
                        default="user",
                        max_length=50,
                        null=True,
                    ),
                ),
            ],
            options={
                "verbose_name": "User",
            },
        ),
    ]
