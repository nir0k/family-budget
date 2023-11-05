from django.apps import apps
from django.core.management.base import BaseCommand
import csv
from transactions.models import Transaction_Type


class Command(BaseCommand):
    help = 'Import data from CSV file into Person model'

    def add_arguments(self, parser):
        parser.add_argument(
            'model_name',
            type=str,
            help="The name of the model to import data into"
        )
        parser.add_argument(
            'csv_file', type=str, help="The path to the CSV file")

    def handle(self, *args, **kwargs):
        model_name = kwargs['model_name']
        csv_file_path = kwargs['csv_file']

        Model = apps.get_model('transactions', model_name)

        model_fields_mapping = {
            'Transaction_Type': ['title', 'type'],
            'Category': ['title', 'type']
        }

        fields = model_fields_mapping[model_name]
        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)

            for row in reader:
                model_data = {field: row[field] for field in fields}
                if model_name == 'Category':
                    t_type = Transaction_Type.objects.get(
                        type=model_data.pop('type'))
                    Model.objects.create(**model_data, type=t_type)
                else:
                    Model.objects.create(**model_data)

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))
