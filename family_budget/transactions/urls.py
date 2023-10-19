from django.urls import path
from transactions.views import (
    transaction_list,
    edit_transaction,
    create_transaction,
    category_list,
    edit_category,
    create_category,
)


urlpatterns = [
    path('', transaction_list, name='transaction_list'),
    path('edit/<int:pk>/', edit_transaction, name='edit_transaction'),
    path('create/', create_transaction, name='create_transaction'),

    path('categories/', category_list, name='category_list'),
    path('categories/edit/<int:pk>/', edit_category, name='edit_category'),
    path('create/', create_category, name='create_category'),
]
