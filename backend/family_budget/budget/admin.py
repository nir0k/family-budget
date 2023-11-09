from budget.models import Budget, ExpenseItem, Family, IncomeItem
from django.contrib import admin


class ExpenseItemInline(admin.TabularInline):
    model = ExpenseItem
    extra = 0


class IncomeItemInline(admin.TabularInline):
    model = IncomeItem
    extra = 0


class FamilyMemberInline(admin.TabularInline):
    model = Family.members.through
    extra = 0


class FamilyAdmin(admin.ModelAdmin):
    inlines = [FamilyMemberInline]
    list_display = ('id', 'title')
    exclude = ('members',)


class BudgetAdmin(admin.ModelAdmin):
    list_display = ('id',
                    'title',
                    'start_date',
                    'end_date',
                    'family',
                    'total_budget',
                    'currency'
                    )
    list_display_links = ('id', 'title')
    empty_value_display = '-empty-'
    inlines = [IncomeItemInline, ExpenseItemInline]


admin.site.register(Budget, BudgetAdmin)
admin.site.register(Family, FamilyAdmin)
