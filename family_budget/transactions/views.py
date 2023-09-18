from rest_framework import viewsets
from django.shortcuts import render
from .models import Transaction, Transaction_Type, Category
from .serializers import (
    TransactionSerializer,
    Transaction_TypeSerializer,
    CategorySerializer
)
from django.views.generic.edit import CreateView
from .forms import TransactionForm
from users.models import User


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
    template = 'transactions/index.html'
    title = 'Анфиса для друзей'
    user = User.objects.get(id=2)
    transactions = Transaction.objects.filter(who=user.id)
    context = {
        'title': title,
        'text': 'Главная страница',
        'transactions': transactions,
        'user': user,
    }
    return render(request, template, context)


class TransactionsView(CreateView):
    form_class = TransactionForm
    template_name = 'transactions/create.html'
    success_url = 'transactions/index.html'
