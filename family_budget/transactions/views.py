from rest_framework import viewsets
from django.shortcuts import render, redirect, get_object_or_404
from .models import Transaction, Transaction_Type, Category
from .serializers import (
    TransactionSerializer,
    Transaction_TypeSerializer,
    CategorySerializer
)
from .forms import TransactionForm, CategoryForm
# from users.models import User
from .filters import TransactionFilter, CategoryFilter
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Sum


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class Transaction_TypeViewSet(viewsets.ModelViewSet):
    queryset = Transaction_Type.objects.all()
    serializer_class = Transaction_TypeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


def index(request):
    template = 'index.html'
    title = 'Family budget'

    income_type = Transaction_Type.objects.get(type='+')
    income_sum = Transaction.objects.filter(
        type=income_type).aggregate(income_total=Sum('amount'))
    total_income = income_sum['income_total'] or 0

    expense_type = Transaction_Type.objects.get(type='-')
    expense_sum = Transaction.objects.filter(
        type=expense_type).aggregate(expense_total=Sum('amount'))
    total_expense = expense_sum['expense_total'] or 0

    transactions = Transaction.objects.all()
    income_per_category = transactions.values(
        'category__title').annotate(category_income=Sum('amount'))

    category_incomes = [{'category_title': cat['category__title'],
                         'category_income': cat['category_income']
                         } for cat in income_per_category]
    context = {
        'title': title,
        'text': 'Family budget',
        'total_income': total_income,
        'total_expense': total_expense,
        'current_balance': total_income - total_expense,
        'category_incomes': category_incomes,
    }
    return render(request, template, context)


def transaction_list(request):
    transactions = Transaction.objects.all()
    transaction_filter = TransactionFilter(request.GET, queryset=transactions)

    if transaction_filter.is_valid():
        transactions = transaction_filter.qs

    page = request.GET.get('page')
    paginator = Paginator(transactions, 10)
    try:
        transactions = paginator.page(page)
    except PageNotAnInteger:
        transactions = paginator.page(1)
    except EmptyPage:
        transactions = paginator.page(paginator.num_pages)

    return render(
        request,
        'transactions/transaction_list.html',
        {'transactions': transactions, 'filter': transaction_filter}
    )


def edit_transaction(request, pk):
    transaction = get_object_or_404(Transaction, pk=pk)

    if request.method == 'POST':
        form = TransactionForm(request.POST, instance=transaction)
        if form.is_valid():
            form.save()
            return redirect('transaction_list')
    else:
        form = TransactionForm(instance=transaction)

    return render(
        request,
        'transactions/edit_transaction.html',
        {'form': form}
    )


def create_transaction(request):
    if request.method == 'POST':
        form = TransactionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('transaction_list')
    else:
        form = TransactionForm()

    return render(
        request,
        'transactions/create_transaction.html',
        {'form': form}
    )


def category_list(request):
    categories = Category.objects.all()
    category_filter = CategoryFilter(request.GET, queryset=categories)

    if category_filter.is_valid():
        categories = category_filter.qs

    return render(
        request,
        'transactions/category_list.html',
        {'categories': categories, 'filter': category_filter})


def edit_category(request, pk):
    category = get_object_or_404(Category, pk=pk)

    if request.method == 'POST':
        form = CategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            return redirect('category_list')
    else:
        form = CategoryForm(instance=category)

    return render(
        request,
        'transactions/edit_category.html',
        {'form': form}
    )


def create_category(request):
    if request.method == 'POST':
        form = TransactionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('category_list')
    else:
        form = TransactionForm()

    return render(
        request,
        'transactions/create_category.html',
        {'form': form}
    )
