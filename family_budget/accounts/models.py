from django.db import models

from users.models import User


class Account_Type(models.Model):
    title = models.CharField(max_length=100)

    class Meta:
        ordering = ["title"]
        verbose_name = "Type"

    def __str__(self):
        return self.title


class Account(models.Model):
    title = models.CharField(max_length=100)
    type = models.ForeignKey(Account_Type,
                             verbose_name="Type",
                             on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=20,
                                decimal_places=2,
                                verbose_name="start value")
    created = models.DateTimeField(auto_now_add=True, db_index=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created"]
        verbose_name = "Account"

    def __str__(self):
        return self.title
