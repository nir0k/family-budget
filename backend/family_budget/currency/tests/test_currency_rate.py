import datetime
from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase

from currency.convector import get_rate_for_date, update_rates_for_date
from currency.models import Currency, ExchangeRate


class CurrencyRateTests(TestCase):

    def setUp(self):
        # Set up your test currencies and rates here
        self.currency1 = Currency.objects.create(code='USD', title='US Dollar')
        self.currency2 = Currency.objects.create(code='EUR', title='Euro')
        self.currency3 = Currency.objects.create(code='RUB',
                                                 title='Russian Ruble')

    @patch('currency.convector.requests.get')
    def test_update_rates_for_date(self, mock_get):
        # Mock the API response
        mock_get.return_value.json.return_value = {
            "success": True,
            "timestamp": 1363478399,
            "historical": True,
            "source": "USD",
            "date": "2013-03-16",
            "quotes": {
                "USDEUR": 0.755616,
                "USDRUB": 30.778374,
            }
        }

        # Call your function
        update_rates_for_date('2013-03-16', 'EUR')

        # Check if the rates were correctly updated in the database
        self.assertTrue(ExchangeRate.objects.filter(
            from_currency=self.currency2,
            to_currency__code='USD',
            rate=Decimal('1.307716').quantize(Decimal('0.0001')),
            rate_date=datetime.date(2013, 3, 16)
        ).exists())

        self.assertTrue(ExchangeRate.objects.filter(
            from_currency=self.currency2,
            to_currency__code='RUB',
            rate=Decimal('1.333812').quantize(Decimal('0.0001')),
            rate_date=datetime.date(2013, 3, 16)
        ).exists())

    def test_get_rate_for_date_existing_rate(self):
        # Set up an existing rate
        new_rate = Decimal('0.85')
        ExchangeRate.objects.create(
            from_currency=self.currency1,
            to_currency=self.currency2,
            rate=new_rate,
            rate_date='2021-01-01'
        )

        # Test existing rate
        rate = get_rate_for_date(self.currency1, self.currency2, '2021-01-01')
        self.assertEqual(rate, new_rate)

    @patch('currency.convector.update_rates_for_date')
    def test_get_rate_for_date_missing_rate(self, mock_update):
        # Mock the update_rates_for_date to simulate rate update
        mock_update.return_value = None

        # Test rate fetching for a date without a rate
        rate = get_rate_for_date(self.currency1, self.currency2, '2021-01-02')
        mock_update.assert_called_with('2021-01-02', 'USD')

        # Assert that the rate is None, as it should be when it's not found
        self.assertIsNone(rate)
