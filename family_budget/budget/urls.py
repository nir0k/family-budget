from django.urls import path
from budget.views import (
    budget_list,
    budget_detail,
)


urlpatterns = [
    path('', budget_list, name='budget_list'),
    path('<int:budget_id>/', budget_detail, name='budget_detail'),
]
