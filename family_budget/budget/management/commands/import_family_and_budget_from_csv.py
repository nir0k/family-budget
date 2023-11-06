import csv
from django.apps import apps
from django.core.management.base import BaseCommand
from django.core.exceptions import ValidationError
from django.db import transaction
from users.models import User
from datetime import datetime
# from budget.models import ExpenseItem, IncomeItem, Category


class Command(BaseCommand):
    help = ('Import families, members, budgets, expense items, and '
            'income items from CSV files')

    def add_arguments(self, parser):
        parser.add_argument(
            'family_csv_file',
            type=str,
            help="The path to the family CSV file"
        )
        parser.add_argument(
            'budget_csv_file',
            type=str,
            help="The path to the budget CSV file"
        )
        parser.add_argument(
            'expense_csv_file',
            type=str,
            help="The path to the expense items CSV file"
        )
        parser.add_argument(
            'income_csv_file',
            type=str,
            help="The path to the income items CSV file"
        )

    def handle(self, *args, **kwargs):
        self.import_families(kwargs['family_csv_file'])
        self.import_budgets(kwargs['budget_csv_file'])
        self.import_expense_items(kwargs['expense_csv_file'])
        self.import_income_items(kwargs['income_csv_file'])

    def import_families(self, csv_file_path):
        Family = apps.get_model('budget', 'Family')
        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                family_title = row['title']
                member_usernames = [
                    username.strip()
                    for username in row['members'].split(';')
                ]

                family, created = Family.objects.get_or_create(
                    title=family_title
                )

                for username in member_usernames:
                    try:
                        member = User.objects.get(username=username)
                        family.members.add(member)
                    except User.DoesNotExist:
                        self.stdout.write(
                            self.style.WARNING(
                                f'User with username "{username}" '
                                'does not exist.'
                            )
                        )

        self.stdout.write(
            self.style.SUCCESS('Families imported successfully')
        )

    @transaction.atomic
    def import_budgets(self, csv_file_path):
        Budget = apps.get_model('budget', 'Budget')
        Family = apps.get_model('budget', 'Family')
        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                try:
                    family = Family.objects.get(title=row['family_title'])
                    budget, created = Budget.objects.get_or_create(
                        title=row['title'],
                        start_date=datetime.strptime(
                            row['start_date'], '%Y-%m-%d').date(),
                        end_date=datetime.strptime(
                            row['end_date'], '%Y-%m-%d').date(),
                        total_budget=row['total_budget'],
                        family=family
                    )
                except Family.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Family with title "{row["family_title"]}" '
                            'does not exist.'
                        )
                    )
                except ValidationError as e:
                    self.stdout.write(
                        self.style.ERROR(
                            f'Error creating budget: {e.messages}'
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS('Budgets imported successfully')
        )

    @transaction.atomic
    def import_expense_items(self, csv_file_path):
        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                self.create_or_update_item(row, 'ExpenseItem', 'expense')

    @transaction.atomic
    def import_income_items(self, csv_file_path):
        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                self.create_or_update_item(row, 'IncomeItem', 'income')

    def create_or_update_item(self, row, model_name, item_type):
        Category = apps.get_model('transactions', 'Category')
        Budget = apps.get_model('budget', 'Budget')
        Model = apps.get_model('budget', model_name)

        try:
            category_title = row['category']
            budget_title = row['budget']
            amount = row['amount']
            description = row.get('description', '')

            category = Category.objects.get(title=category_title)
            budget = Budget.objects.get(title=budget_title)

            item, created = Model.objects.get_or_create(
                category=category,
                budget=budget,
                defaults={
                    'amount': amount,
                    'description': description
                }
            )
            if not created:
                item.amount = amount
                item.description = description
                item.save()

        except Category.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'Category "{category_title}" does not exist.'
                )
            )
        except Budget.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'Budget "{budget_title}" does not exist.'
                )
            )
        except ValidationError as e:
            self.stdout.write(
                self.style.ERROR(
                    f'Error creating {item_type} item: {e.messages}'
                )
            )
