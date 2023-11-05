from django.contrib import admin
from .models import Currency, ExchangeRate


class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'code')
    list_display_links = ('id', 'title')
    empty_value_display = '-empty-'


class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'from_currency',
        'to_currency',
        'rate',
        'rate_date',
        'last_updated'
    )
    list_display_links = (
        'id', 'from_currency', 'to_currency', 'rate', 'last_updated')
    empty_value_display = '-empty-'


admin.site.register(Currency, CurrencyAdmin)
admin.site.register(ExchangeRate, ExchangeRateAdmin)
