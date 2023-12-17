from django_filters import CharFilter
from django_filters import rest_framework as filters

from .models import Category, Transaction


class TransactionFilter(filters.FilterSet):
    title = filters.CharFilter(
        field_name='title', lookup_expr='icontains')
    description = filters.CharFilter(
        field_name='description', lookup_expr='icontains')

    class Meta:
        model = Transaction
        fields = [
            'title',
            'type',
            'category',
            'who',
            'account',
            'description'
        ]


class CategoryFilter(filters.FilterSet):
    type_title = CharFilter(field_name='type__title', lookup_expr='exact')

    class Meta:
        model = Category
        fields = ['type_title']
