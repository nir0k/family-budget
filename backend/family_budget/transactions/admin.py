from django.contrib import admin

from .models import Category, Transaction, Transaction_Type


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'type')
    list_display_links = ('id', 'title')
    search_fields = ('id', 'title', 'type')
    list_filter = ('type',)
    empty_value_display = '-empty-'


class Transaction_TypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'type')
    list_display_links = ('id', 'title', 'type')
    search_fields = ('title',)
    list_filter = ('type',)
    empty_value_display = '-empty-'


class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'title', 'type', 'category', 'who',
        'account', 'amount', 'currency', 'author', 'date'
    )
    list_display_links = ('id', 'title')
    search_fields = (
        'id', 'title', 'category', 'date', 'currency'
    )
    list_filter = (
        'type', 'category', 'who', 'account',
        'author', 'date', 'currency'
    )
    empty_value_display = '-empty-'


admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Transaction_Type, Transaction_TypeAdmin)
admin.site.register(Category, CategoryAdmin)