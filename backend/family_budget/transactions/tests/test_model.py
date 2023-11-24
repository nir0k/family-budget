from datetime import date
from decimal import Decimal

from django.test import TestCase

from accounts.models import Account, Account_Type
from currency.models import Currency, ExchangeRate
from transactions.models import Category, Transaction, Transaction_Type
from users.models import User


class AccountBalanceTest(TestCase):
    def setUp(self):
        self.date = date(2020, 1, 15)
        Account_Type.objects.create(title="Card")
        self.currency1 = Currency.objects.create(title="Dollar US", code="USD")
        self.currency2 = Currency.objects.create(title="EURO", code="EUR")
        self.currency3 = Currency.objects.create(title="HUF", code="HUF")
        self.user = User.objects.create(
            username="User1",
            email="user1@test.com",
            password="P@ssw0rd1"
        )
        self.t_type_expense = Transaction_Type.objects.create(
            title="Expense", type="Expense")
        self.t_type_income = Transaction_Type.objects.create(
            title="Income", type="Income")
        self.t_type_transfer = Transaction_Type.objects.create(
            title="Transfer", type="Transef")
        self.category_expense = Category.objects.create(
            title="Food", type=Transaction_Type.objects.get(title="Expense"))
        self.category_income = Category.objects.create(
            title="Sallary", type=Transaction_Type.objects.get(title="Income"))
        self.category_transfer = Category.objects.create(
            title="Transfer",
            type=Transaction_Type.objects.get(title="Transfer")
        )
        self.account1 = Account.objects.create(
            title="Test Account USD",
            balance=Decimal('100.00'),
            type=Account_Type.objects.get(title="Card"),
            currency=self.currency1,
            owner=self.user
        )
        self.account2 = Account.objects.create(
            title="Test Account EUR",
            balance=Decimal('200.00'),
            type=Account_Type.objects.get(title="Card"),
            currency=self.currency2,
            owner=self.user
        )
        self.account3 = Account.objects.create(
            title="Test Account HUF",
            balance=Decimal('1000000.00'),
            type=Account_Type.objects.get(title="Card"),
            currency=self.currency3,
            owner=self.user
        )
        ExchangeRate.objects.create(
            from_currency=self.currency1,
            to_currency=self.currency2,
            rate=2,
            rate_date=self.date
        )
        ExchangeRate.objects.create(
            from_currency=self.currency2,
            to_currency=self.currency1,
            rate=4,
            rate_date=self.date
        )
        ExchangeRate.objects.create(
            from_currency=self.currency3,
            to_currency=self.currency1,
            rate=6,
            rate_date=self.date
        )
        ExchangeRate.objects.create(
            from_currency=self.currency1,
            to_currency=self.currency3,
            rate=7,
            rate_date=self.date
        )

    def test_income_transaction_in_same_currency(self):
        """Test creating, edit and delete income transaction
        with same currency"""
        transaction = Transaction.objects.create(
            title='Test income account 1 in USD',
            type=self.t_type_income,
            category=self.category_income,
            who=self.user,
            account=self.account1,
            amount=Decimal('50.00'),
            currency=self.currency1,
            author=self.user,
            date=self.date
        )
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('150.00'))

        transaction.amount = 30
        transaction.save()
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('130.00'))

        transaction.delete()
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('100.00'))

    def test_expense_transaction_in_same_currency(self):
        """Test creating, edit and delete expense transaction
        with same currency"""
        transaction = Transaction.objects.create(
            title='Test expense account 1 in USD',
            type=self.t_type_expense,
            category=self.category_expense,
            who=self.user,
            account=self.account1,
            amount=Decimal('30.00'),
            currency=self.currency1,
            author=self.user,
            date=self.date
        )
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('70.00'))

        transaction.amount = 50
        transaction.save()
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('50.00'))

        transaction.delete()
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('100.00'))

    def test_transfer_transaction_in_same_currency(self):
        """Test creating, edit and delete transfer transaction
        with same currency"""
        transaction = Transaction.objects.create(
            title='Test transfer account 1 in USD to account 2 EUR',
            type=self.t_type_transfer,
            category=self.category_transfer,
            who=self.user,
            account=self.account1,
            amount=Decimal('30.00'),
            currency=self.currency1,
            author=self.user,
            date=self.date,
            account_to=self.account2
        )
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('70.00'))
        self.assertEqual(self.account2.balance, Decimal('260.00'))

        transaction.amount = 15
        transaction.save()
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('85.00'))
        self.assertEqual(self.account2.balance, Decimal('230.00'))

        transaction.delete()

        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('100.00'))
        self.assertEqual(self.account2.balance, Decimal('200.00'))

    def test_income_transaction_in_diferent_currency(self):
        """Test creating, edit and delete income transaction
        with different currency"""
        transaction = Transaction.objects.create(
            title='Test income account 1 in EUR',
            type=self.t_type_income,
            category=self.category_income,
            who=self.user,
            account=self.account1,
            amount=Decimal('50.00'),
            currency=self.currency2,
            author=self.user,
            date=self.date
        )
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('300.00'))

        transaction.amount = 25
        transaction.save()
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('200.00'))

        transaction.delete()
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('100.00'))

    def test_expense_transaction_in_diferent_currency(self):
        """Test creating, edit and delete expense transaction
        with different currency"""
        transaction = Transaction.objects.create(
            title='Test expense account 1 in USD',
            type=self.t_type_expense,
            category=self.category_expense,
            who=self.user,
            account=self.account2,
            amount=Decimal('20.00'),
            currency=self.currency1,
            author=self.user,
            date=self.date
        )
        self.account2.refresh_from_db()
        self.assertEqual(self.account2.balance, Decimal('160.00'))

        transaction.amount = 40
        transaction.save()
        self.account2.refresh_from_db()
        self.assertEqual(self.account2.balance, Decimal('120.00'))

        transaction.delete()
        self.account2.refresh_from_db()
        self.assertEqual(self.account2.balance, Decimal('200.00'))

    def test_create_and_delete_transfer_transaction_in_diferent_currency(self):
        """Test creating, edit and delete an transfer transaction
        with different currency"""
        transaction = Transaction.objects.create(
            title='Test transfer in HUF from account 1 USD to account 2 EUR',
            type=self.t_type_transfer,
            category=self.category_transfer,
            who=self.user,
            account=self.account1,
            amount=Decimal('30.00'),
            currency=self.currency3,
            author=self.user,
            date=self.date,
            account_to=self.account2
        )
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('-80.00'))
        self.assertEqual(self.account2.balance, Decimal('560.00'))

        transaction.amount = 15
        transaction.save()
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('10.00'))
        self.assertEqual(self.account2.balance, Decimal('380.00'))

        transaction.account_to = self.account3
        transaction.save()
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.account3.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('10.00'))
        self.assertEqual(self.account2.balance, Decimal('200.00'))
        self.assertEqual(self.account3.balance, Decimal('1000630.00'))

        transaction.delete()

        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.account3.refresh_from_db()
        self.assertEqual(self.account1.balance, Decimal('100.00'))
        self.assertEqual(self.account2.balance, Decimal('200.00'))
        self.assertEqual(self.account3.balance, Decimal('1000000.00'))