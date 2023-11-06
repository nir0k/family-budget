from django.apps import apps
from django.core.management.base import BaseCommand
from django.db import transaction
import csv


class Command(BaseCommand):
    help = 'Import data from CSV file into Account and Account_Type models'

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

        Model = apps.get_model('accounts', model_name)

        model_fields_mapping = {
            'Account_Type': ['title'],
            'Account': ['title', 'value', 'currency', 'owner', 'type']
        }

        fields = model_fields_mapping[model_name]
        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)
            with transaction.atomic():
                for row in reader:
                    if model_name == 'Account':
                        type_title = row['type']
                        username = row['owner']
                        currency_code = row['currency']

                        account_type = apps.get_model(
                            'accounts',
                            'Account_Type').objects.get(title=type_title)
                        owner = apps.get_model(
                            'users', 'User').objects.get(username=username)
                        currency = apps.get_model(
                            'currency',
                            'Currency').objects.get(code=currency_code)

                        model_data = {
                            'title': row['title'],
                            'value': row['value'],
                            'type': account_type,
                            'owner': owner,
                            'currency': currency,
                        }
                    else:
                        model_data = {field: row[field] for field in fields}

                    Model.objects.create(**model_data)

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))
