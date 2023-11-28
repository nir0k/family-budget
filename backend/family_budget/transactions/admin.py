from django import forms
from django.contrib import admin

from .models import Category, Transaction, Transaction_Type


class TransactionAdminForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = '__all__'
        exclude = ('type',)  # Exclude 'type' field from form validation

    def clean(self):
        cleaned_data = super().clean()
        category = cleaned_data.get('category')

        if category:
            cleaned_data['type'] = category.type

        return cleaned_data


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
    form = TransactionAdminForm
    list_display = (
        'id', 'title', 'category', 'who',
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
