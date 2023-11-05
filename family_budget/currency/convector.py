import requests
from .models import ExchangeRate, Currency
from datetime import datetime


ENDPOINT = 'http://apilayer.net/api/live'


# def update_rates(
#         date=datetime.now().strftime('%Y-%m-%d')):

#     params = {
#         'access_key': '4e551c113c289e133ec6371d93293907',
#         'currencies': 'EUR,USD,RUB,KZT',
#         'source': 'HUF',
#         'format': 1,
#         'date': date,
#     }

#     response = requests.get(ENDPOINT, params=params)
#     data = response.json()

#     if data.get('success'):
#         source_currency_code = data['source']
#         # Ensure the source currency exists
#         source_currency, created = Currency.objects.get_or_create(
#             code=source_currency_code)

#         for quote, rate in data['quotes'].items():
#             target_currency_code = quote[3:]
#             target_currency, created = Currency.objects.get_or_create(
#                 code=target_currency_code)
#             ExchangeRate.objects.update_or_create(
#                 from_currency=source_currency,
#                 to_currency=target_currency,
#                 defaults={'rate': rate}
#             )


# def convert_amount(amount, from_currency, to_currency):
#     rate = ExchangeRate.objects.get(
#         from_currency=from_currency, to_currency=to_currency).rate
#     return amount / rate


def update_rates_for_date(date=None):

    params = {
        'access_key': '4e551c113c289e133ec6371d93293907',
        'currencies': 'EUR,USD,RUB,KZT',
        'source': 'HUF',
        'format': 1,
        'date': date,
    }
    response = requests.get(ENDPOINT, params=params)
    data = response.json()

    if data.get('success'):
        source_currency_code = data['source']
        source_currency, created = Currency.objects.get_or_create(
            code=source_currency_code)

        for quote, rate in data['quotes'].items():
            target_currency_code = quote[3:]
            target_currency, created = Currency.objects.get_or_create(
                code=target_currency_code)

            rate_date = datetime.fromtimestamp(data['timestamp']).date() if not date else date
            ExchangeRate.objects.update_or_create(
                from_currency=source_currency,
                to_currency=target_currency,
                rate_date=rate_date,
                defaults={'rate': rate}
            )


def get_rate_for_date(from_currency, to_currency, date):
    try:
        rate_obj = ExchangeRate.objects.get(
            from_currency=from_currency, to_currency=to_currency, date=date)
        return rate_obj.rate
    except ExchangeRate.DoesNotExist:
        return None
