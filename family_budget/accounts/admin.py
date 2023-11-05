from django.contrib import admin
from .models import Account, Account_Type


class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'short_title')
    list_display_links = ('id', 'title', 'short_title')
    empty_value_display = '-empty-'


class AccountAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'title', 'type', 'currency', 'value', 'created', 'owner')
    list_display_links = ('id', 'title', 'type', 'value', 'created', 'owner')
    search_fields = ('title', 'type', 'value', 'created', 'owner')
    list_filter = ('type', 'created', 'owner')
    empty_value_display = '-empty-'


class Account_TypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    list_display_links = ('id', 'title')
    search_fields = ('title',)
    empty_value_display = '-empty-'


admin.site.register(Account, AccountAdmin)
admin.site.register(Account_Type, Account_TypeAdmin)
