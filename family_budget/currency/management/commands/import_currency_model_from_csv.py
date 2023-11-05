from django.apps import apps
from django.core.management.base import BaseCommand
import csv


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

        Model = apps.get_model('currency', model_name)

        model_fields_mapping = {
            'Currency': ['title', 'code'],
        }

        fields = model_fields_mapping[model_name]
        with open(csv_file_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)

            for row in reader:
                model_data = {field: row[field] for field in fields}
                Model.objects.create(**model_data)

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))
