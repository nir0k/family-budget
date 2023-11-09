import csv

from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError

from transactions.models import Category, Transaction_Type


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
        model = apps.get_model('transactions', model_name)
        model_fields_mapping = {
            'Transaction_Type': ['title', 'type'],
            'Category': ['title', 'type'],
            'Transaction': [
                'title', 'type', 'category', 'who',
                'account', 'amount', 'currency',
                'description', 'author', 'date']
        }

        fields = model_fields_mapping.get(model_name, [])

        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)

            for row in reader:
                if model_name == 'Transaction':
                    self.import_transaction(model, row)
                elif model_name == 'Category':
                    self.import_category(model, row)
                else:
                    self.import_other(model, row, fields)

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))

    def import_transaction(self, model, row):
        try:
            transaction_data = {
                'title': row['title'],
                'amount': row['amount'],
                'description': row['description'],
                'date': row['date']
            }

            transaction_data['type'] = self.get_transaction_type(row['type'])
            transaction_data['category'] = self.get_category(row['category'])
            transaction_data['who'] = self.get_user(row['who'])
            transaction_data['account'] = self.get_account(
                row['account'], transaction_data['who'])
            transaction_data['currency'] = self.get_currency(row['currency'])
            transaction_data['author'] = self.get_user(row['author'])

            model.objects.create(**transaction_data)
        except ObjectDoesNotExist as e:
            self.stdout.write(self.style.ERROR(
                f'Error creating transaction: {e}'))
        except IntegrityError as e:
            self.stdout.write(self.style.ERROR(f'Duplicate entry: {e}'))

    def get_transaction_type(self, type_code):
        return Transaction_Type.objects.get(type=type_code)

    def get_category(self, type):
        return Category.objects.get(title=type)

    def get_user(self, username):
        User = apps.get_model('users', 'User')
        return User.objects.get(username=username)

    def get_account(self, title, user):
        Account = apps.get_model('accounts', 'Account')
        return Account.objects.get(title=title, owner=user)

    def get_currency(self, code):
        Currency = apps.get_model('currency', 'Currency')
        return Currency.objects.get(code=code)

    def import_category(self, model, row):
        try:
            type = row['type']
            transaction_type, created = Transaction_Type.objects.get_or_create(
                type=type,
                defaults={'type': type[0]}
            )

            category, created = model.objects.get_or_create(
                title=row['title'],
                defaults={'type': transaction_type}
            )

            if created:
                self.stdout.write(self.style.SUCCESS(
                    f'Category "{category.title}" created successfully'))
            else:
                self.stdout.write(self.style.WARNING(
                    f'Category "{category.title}" already exists'))

        except IntegrityError as e:
            self.stdout.write(self.style.ERROR(f'Duplicate entry: {e}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'Error creating category: {e}'))

    def import_other(self, model, row, fields):
        model_data = {field: row[field] for field in fields}
        model.objects.create(**model_data)
