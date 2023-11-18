import csv
from datetime import datetime

from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError

from budget.models import Budget, Family
from currency.models import Currency
from transactions.models import Category
from users.models import User


class Command(BaseCommand):
    help = 'Import data from CSV file into the specified model'

    def add_arguments(self, parser):
        parser.add_argument(
            'model_name',
            type=str,
            help="The name of the model to import data into"
        )
        parser.add_argument(
            'csv_file', type=str, help="The path to the CSV file"
        )

    def handle(self, *args, **kwargs):
        model_name = kwargs['model_name']
        csv_file_path = kwargs['csv_file']
        model = apps.get_model('budget', model_name)
        model_fields_mapping = {
            'Family': ['title', 'members'],
            'Budget': ['title', 'start_date', 'end_date',
                       'total_budget', 'family', 'currency'],
            'ExpenseItem': ['category', 'budget', 'amount', 'description'],
            'IncomeItem': ['category', 'budget', 'amount', 'description'],
        }

        fields = model_fields_mapping.get(model_name, [])

        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)

            for row in reader:
                if model_name == 'Family':
                    self.import_family(model, row)
                elif model_name == 'Budget':
                    self.import_budget(model, row)
                elif model_name == 'ExpenseItem':
                    self.import_ExpenseItem(model, row)
                elif model_name == 'IncomeItem':
                    self.import_ExpenseItem(model, row)
                else:
                    self.import_other(model, row, fields)

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))

    def import_family(self, model, row):
        try:
            family_data = {
                'title': row['title'],
            }
            member_usernames = [
                username.strip()
                for username in row['members'].split(';')
            ]

            family, created = model.objects.get_or_create(
                **family_data
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
        except ObjectDoesNotExist as e:
            self.stdout.write(self.style.ERROR(
                f'Error creating family: {e}'))
        except IntegrityError as e:
            self.stdout.write(self.style.ERROR(f'Duplicate entry: {e}'))

    def import_budget(self, model, row):
        try:
            budget_data = {
                'title': row['title'],
                'start_date': datetime.strptime(
                    row['start_date'], '%Y-%m-%d').date(),
                'end_date': datetime.strptime(
                    row['end_date'], '%Y-%m-%d').date(),
                'total_budget': row['total_budget'],
            }
            budget_data['family'] = Family.objects.get(
                title=row['family_title'])
            budget_data['currency'] = Currency.objects.get(
                code=row['currency'])

            model.objects.create(**budget_data)

        except IntegrityError as e:
            self.stdout.write(self.style.ERROR(f'Duplicate entry: {e}'))
        except Family.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'Family with title "{row["family_title"]}" '
                    'does not exist.'
                )
            )
        except Currency.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'Currency with code "{row["currency"]}" '
                    'does not exist.'
                )
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'Error creating budget: {e}'))

    def import_ExpenseItem(self, model, row):
        try:
            category = Category.objects.get(title=row['category'])
            budget = Budget.objects.get(title=row['budget'])

            expense_item = model.objects.get(
                category=category, budget=budget)
            expense_item.amount = row['amount']
            expense_item.description = row['description']
            expense_item.save()
        except Category.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'Category with title "{row["category"]}" '
                    'does not exist.'
                )
            )
        except Budget.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'Budget with title "{row["budget"]}" '
                    'does not exist.'
                )
            )
        except model.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(
                    f'{model} with category "{row["category"]}"'
                    ' and budget "{row["budget"]}" does not exist.'
                )
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'Error creating ExpenseItem: {e}'))

    def import_other(self, model, row, fields):
        model_data = {field: row[field] for field in fields}
        model.objects.create(**model_data)
