from django.contrib import admin

from .models import Transaction, Transaction_Type, Category

admin.site.register(Transaction)
admin.site.register(Transaction_Type)
admin.site.register(Category)
