from django.urls import path
from budget.views import (
    budget_list,
    budget_detail,
    edit_budget,
    edit_expense_item,
    copy_budget
)


urlpatterns = [
    path('', budget_list, name='budget_list'),
    path('<int:budget_id>/', budget_detail, name='budget_detail'),
    path('edit/<int:budget_id>/', edit_budget, name='edit_budget'),
    path('edit/item/<int:item_id>/',
         edit_expense_item,
         name='edit_expense_item'),
    path('copy/<int:budget_id>/', copy_budget, name='copy_budget'),
]
