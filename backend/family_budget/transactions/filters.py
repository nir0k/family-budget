import django_filters

from .models import Category, Transaction


class TransactionFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(
        field_name='title', lookup_expr='icontains')
    description = django_filters.CharFilter(
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


class CategoryFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(
        field_name='title', lookup_expr='icontains')

    class Meta:
        model = Category
        fields = [
            'title',
            'type',
        ]
