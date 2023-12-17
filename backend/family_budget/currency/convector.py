import os
from datetime import datetime
from decimal import Decimal

import requests
from dotenv import load_dotenv

from .models import Currency, ExchangeRate

load_dotenv()

ACCESS_KEY = os.getenv('ACCESS_KEY_CURRENCY_RATE')
ENDPOINT = os.getenv('CURRENCY_RATE_API_ENDPOINT')


def update_rates_for_date(date, curency):
    currencies = Currency.objects.exclude(code=curency)
    codes = ','.join([currency.code for currency in currencies])

    params = {
        'access_key': ACCESS_KEY,
        'currencies': codes,
        # 'base': curency,
        'format': 1,
        'date': date
    }
    response = requests.get(f'{ENDPOINT}/historical', params=params)
    data = response.json()

    if data.get('success'):
        source_currency_code = data['base']
        source_currency, created = Currency.objects.get_or_create(
            code=source_currency_code)

        for quote, rate in data['rates'].items():
            target_currency_code = quote[3:]
            target_currency, created = Currency.objects.get_or_create(
                code=target_currency_code
            )

            rate_date = (datetime.fromtimestamp(data['timestamp']).date()
                         if not date else date)
            ExchangeRate.objects.update_or_create(
                from_currency=source_currency,
                to_currency=target_currency,
                rate_date=rate_date,
                defaults={'rate': rate}
            )


def get_rate_for_date(from_currency, to_currency, date) -> Decimal:
    try:
        rate_obj = ExchangeRate.objects.get(
            from_currency=from_currency,
            to_currency=to_currency,
            rate_date=date
        )
        return rate_obj.rate
    except ExchangeRate.DoesNotExist:
        # update_rates_for_date(date, from_currency.code)
        # try:
        #     rate_obj = ExchangeRate.objects.get(
        #         from_currency=from_currency,
        #         to_currency=to_currency,
        #         rate_date=date
        #     )
        #     return rate_obj.rate
        # except ExchangeRate.DoesNotExist:
        #     return None
        return None
