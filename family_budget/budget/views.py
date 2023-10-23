from django.shortcuts import render, get_object_or_404, redirect
from .models import Budget, ExpenseItem
from transactions.models import Category
from .forms import BudgetForm, ExpenseItemForm
# from django.db.models import Q
from rest_framework import viewsets
from .serializers import BudgetSerializer, ExpenseItemSerializer


def budget_list(request):
    budgets = Budget.objects.all()

    if request.method == 'POST':
        form = BudgetForm(request.POST)
        if 'delete' in request.POST:
            item_id = int(request.POST['delete'])
            item_to_delete = get_object_or_404(Budget, pk=item_id)
            item_to_delete.delete()
        else:
            if form.is_valid():
                new_budget = form.save()

                expense_categories = Category.objects.filter(type__type='-')
                for category in expense_categories:
                    ExpenseItem.objects.create(
                        description=f"Expense for {category.title}",
                        category=category,
                        budget=new_budget,
                        amount=0.0
                    )

                income_categories = Category.objects.filter(type__type='+')
                for category in income_categories:
                    ExpenseItem.objects.create(
                        description=f"Income for {category.title}",
                        category=category,
                        budget=new_budget,
                        amount=0.0
                    )

        return redirect('budget_list')
    else:
        form = BudgetForm()

    return render(
        request,
        'budget/budget_list.html',
        {
            'budgets': budgets,
            'form': form
        }
    )


def budget_detail(request, budget_id):
    budget = get_object_or_404(Budget, pk=budget_id)
    expense_items = budget.expense_items.all()

    if request.method == 'POST':
        expense_item_form = ExpenseItemForm(request.POST)
        if 'delete' in request.POST:
            item_id = int(request.POST['delete'])
            item_to_delete = get_object_or_404(ExpenseItem, pk=item_id)
            item_to_delete.delete()
        else:
            if expense_item_form.is_valid():
                new_item = expense_item_form.save(commit=False)
                new_item.budget = budget
                new_item.save()
        return redirect('budget_detail', budget_id=budget_id)

    else:
        expense_item_form = ExpenseItemForm()

    return render(
        request,
        'budget/budget_detail.html',
        {
            'budget': budget,
            'expense_items': expense_items,
            'expense_item_form': expense_item_form
        }
    )


def edit_budget(request, budget_id):
    budget = get_object_or_404(Budget, pk=budget_id)

    if request.method == 'POST':
        form = BudgetForm(request.POST, instance=budget)
        if form.is_valid():
            form.save()
            return redirect('budget_list')

    else:
        form = BudgetForm(instance=budget)

    return render(
        request,
        'budget/edit_budget.html',
        {'form': form, 'budget': budget}
    )


def edit_expense_item(request, item_id):
    item = get_object_or_404(ExpenseItem, pk=item_id)

    if request.method == 'POST':
        form = ExpenseItemForm(request.POST, instance=item)
        if form.is_valid():
            form.save()
            return redirect('budget_detail', budget_id=item.budget.id)

    else:
        form = ExpenseItemForm(instance=item)

    return render(
        request,
        'budget/edit_expense_item.html',
        {'form': form, 'item': item}
    )


def delete_budget(request, budget_id):
    budget = get_object_or_404(Budget, pk=budget_id)

    if request.method == 'POST':
        budget.delete()
        return redirect('budget_list')

    return render(
        request,
        'budget/delete_budget.html',
        {'budget': budget}
    )


def copy_budget(request, budget_id):
    original_budget = get_object_or_404(Budget, pk=budget_id)

    if request.method == 'POST':
        form = BudgetForm(request.POST, instance=original_budget)
        if form.is_valid():
            new_budget = form.save(commit=False)
            new_budget.pk = None
            new_budget.title = f"Copy of {original_budget.title}"
            new_budget.save()

            original_items = original_budget.expenseitem_set.all()
            for original_item in original_items:
                new_item = original_item
                new_item.pk = None
                new_item.budget = new_budget
                new_item.save()

            return redirect('budget_list')

    else:
        form = BudgetForm(instance=original_budget)

    return render(
        request,
        'budget/copy_budget.html',
        {'form': form, 'original_budget': original_budget}
    )


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer


class ExpenseItemViewSet(viewsets.ModelViewSet):
    queryset = ExpenseItem.objects.all()
    serializer_class = ExpenseItemSerializer
