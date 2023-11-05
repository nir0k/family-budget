from django.db import models
from datetime import date


class Currency(models.Model):
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=3)

    def __str__(self):
        return self.code


class ExchangeRate(models.Model):
    from_currency = models.ForeignKey(Currency,
                                      related_name='from_rates',
                                      on_delete=models.CASCADE)
    to_currency = models.ForeignKey(Currency,
                                    related_name='to_rates',
                                    on_delete=models.CASCADE)
    rate = models.DecimalField(max_digits=10, decimal_places=4)
    rate_date = models.DateField(default=date.today)
    last_updated = models.DateTimeField(auto_now=True)
