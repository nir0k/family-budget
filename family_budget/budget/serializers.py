from rest_framework import serializers
from .models import Budget, ExpenseItem


class ExpenseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseItem
        fields = (
            'id',
            'description',
            'category',
            'budget',
            'amount',
        )


class BudgetSerializer(serializers.ModelSerializer):
    expense_items = ExpenseItemSerializer(many=True, required=False)

    class Meta:
        model = Budget
        fields = (
            'id',
            'title',
            'start_date',
            'end_date',
            'total_budget',
            'expense_items'
        )

    def create(self, validated_data):
        expense_items_data = validated_data.pop('expense_items', [])
        budget = Budget.objects.create(**validated_data)
        for item_data in expense_items_data:
            ExpenseItem.objects.create(budget=budget, **item_data)
        return budget

    def update(self, instance, validated_data):
        expense_items_data = validated_data.pop(
            'expense_items', [])
        instance.title = validated_data.get(
            'title', instance.title)
        instance.start_date = validated_data.get(
            'start_date', instance.start_date)
        instance.end_date = validated_data.get(
            'end_date', instance.end_date)
        instance.total_budget = validated_data.get(
            'total_budget', instance.total_budget)
        instance.save()

        for item_data in expense_items_data:
            item_id = item_data.get('id', None)
            if item_id:
                expense_item = ExpenseItem.objects.get(
                    id=item_id, budget=instance)
                expense_item.description = item_data.get(
                    'description', expense_item.description)
                expense_item.category = item_data.get(
                    'category', expense_item.category)
                expense_item.amount = item_data.get(
                    'amount', expense_item.amount)
                expense_item.save()
            else:
                ExpenseItem.objects.create(budget=instance, **item_data)

        return instance
