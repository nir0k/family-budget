# from django.db import models
# from django.utils import timezone


# class YearMonthField(models.Field):
#     def db_type(self, connection):
#         return 'date'

#     def from_db_value(self, value, expression, connection):
#         if value is None:
#             return None
#         return value

#     def to_python(self, value):
#         if value is None or isinstance(value, (tuple, list)):
#             return value

#         if isinstance(value, str):
#             # Convert from a string (e.g., 'YYYY-MM') to a Python tuple
#             year, month = map(int, value.split('-'))
#             return (year, month)

#         if isinstance(value, timezone.datetime):
#             # Extract year and month components from a datetime
#             return (value.year, value.month)

#         return value

#     def get_prep_value(self, value):
#         if value is None:
#             return None
#         return f'{value[0]:04d}-{value[1]:02d}'

#     def value_to_string(self, obj):
#         value = self.value_from_object(obj)
#         return self.get_prep_value(value)
