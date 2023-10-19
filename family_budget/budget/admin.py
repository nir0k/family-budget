from django.contrib import admin
from budget.models import Budget, ExpenseItem


class ExpenseItemInline(admin.TabularInline):
    model = ExpenseItem
    extra = 1


class BudgetAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'start_date', 'end_date', 'total_budget')
    list_display_links = ('id', 'title')
    empty_value_display = '-empty-'
    inlines = [ExpenseItemInline]


admin.site.register(Budget, BudgetAdmin)
