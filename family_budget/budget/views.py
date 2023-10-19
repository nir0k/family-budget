from django.shortcuts import render, get_object_or_404, redirect
from .models import Budget, ExpenseItem
from .forms import BudgetForm, ExpenseItemForm


def budget_list(request):
    budgets = Budget.objects.all()

    if request.method == 'POST':
        form = BudgetForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('budget_list')

    else:
        form = BudgetForm()

    return render(
        request,
        'budget/budget_list.html',
        {'budgets': budgets, 'form': form}
    )


def budget_detail(request, budget_id):
    budget = get_object_or_404(Budget, pk=budget_id)
    expense_items = budget.expenseitem_set.all()

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
