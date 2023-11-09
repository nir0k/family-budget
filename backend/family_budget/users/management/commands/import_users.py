import csv

from django.core.management.base import BaseCommand

from users.models import User


class Command(BaseCommand):
    help = 'Import users from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file',
                            type=str,
                            help='The CSV file to import.')

    def handle(self, *args, **options):
        with open(options['csv_file'], newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                try:
                    user, created = User.objects.get_or_create(
                        username=row['username'],
                        email=row['email'],
                        defaults={
                            'first_name': row.get('first_name', ''),
                            'last_name': row.get('last_name', ''),
                            'role': row.get('role', 'user')
                        }
                    )
                    if created:
                        user.set_password(row['password'])
                        user.is_admin = row.get('role', 'user') == 'admin'
                        if user.is_admin:
                            user.is_superuser = True
                        user.save()
                        self.stdout.write(self.style.SUCCESS(
                            f"User {user.username} created successfully."))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(
                        f"Error creating user {row['username']}: {e}"))
