from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from accounts.models import Account, Account_Type
from currency.models import Currency
from users.models import User


class ApiAccountTypeTest(APITestCase):
    def setUp(self):
        self.url = '/api/v1/account-type/'
        user = User.objects.create_user(
            username="User1",
            email="user1@test.com",
            password="P@ssw0rd1"
        )
        self.token = Token.objects.create(user=user)
        self.unauth_client = self.client
        self.auth_client = APIClient()
        self.auth_client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.token.key
        )

    def test_ApiAccountType(self):
        data = {'title': 'Card'}
        response = self.auth_client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED,
                         'Response code should be 201')
        id = response.data['id']
        self.assertEqual(response.data['title'], data['title'])
        account_type = Account_Type.objects.get(pk=id)
        self.assertEqual(account_type.title, data['title'])

        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code shold be 200')
        self.assertEqual(response.data[0]['title'], data['title'])

        data = {'title': 'Card1'}
        url = self.url + f'{id}/'
        response = self.auth_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        self.assertEqual(response.data['title'], data['title'])
        account_type = Account_Type.objects.get(pk=id)
        self.assertEqual(account_type.title, data['title'])

        data = {'title': 'Card2'}
        response = self.auth_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        self.assertEqual(response.data['title'], data['title'])
        account_type = Account_Type.objects.get(pk=id)
        self.assertEqual(account_type.title, data['title'])

        response = self.auth_client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT,
                         'Response code should be 204')


class ApiAccountTest(APITestCase):
    def setUp(self):
        self.url = '/api/v1/account/'
        self.user = User.objects.create_user(
            username="User1",
            email="user1@test.com",
            password="P@ssw0rd1"
        )
        self.account_type1 = Account_Type.objects.create(
            title='Card')
        self.account_type2 = Account_Type.objects.create(
            title='Walet')
        self.currency1 = Currency.objects.create(
            title='US Dollar',
            code='USD'
        )
        self.currency2 = Currency.objects.create(
            title='Euro',
            code='EUR'
        )
        self.token = Token.objects.create(user=self.user)
        self.unauth_client = self.client
        self.auth_client = APIClient()
        self.auth_client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.token.key
        )

    def test_ApiAccount(self):
        data = {
            'title': 'Test Account 1',
            'type': self.account_type1.id,
            'currency': self.currency1.id,
            'owner': self.user.id
        }
        response = self.auth_client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED,
                         'Response code should be 201')
        id = response.data['id']
        account = Account.objects.get(pk=id)
        self.assertEqual(account.title, data['title'])
        self.assertEqual(account.type.id, data['type'])
        self.assertEqual(account.currency.id, data['currency'])
        self.assertEqual(account.owner.id, data['owner'])
        self.assertEqual(account.balance, 0)

        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code shold be 200')
        self.assertEqual(response.data[0]['title'], account.title)
        self.assertEqual(response.data[0]['type'], account.type.id)
        self.assertEqual(response.data[0]['currency'], account.currency.id)
        self.assertEqual(response.data[0]['owner'], account.owner.id)
        self.assertEqual(float(response.data[0]['balance']),
                         float(account.balance))

        data = {
            'title': 'Test Account 1 path',
            'balance': 50
        }
        url = self.url + f'{id}/'
        response = self.auth_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        account = Account.objects.get(pk=id)
        self.assertEqual(account.title, data['title'])
        self.assertEqual(account.balance, data['balance'])

        data = {
            'title': 'Test Account 1 put',
            'type': self.account_type1.id,
            'currency': self.currency1.id,
            'owner': self.user.id,
            'balance': 0
        }
        response = self.auth_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        account = Account.objects.get(pk=id)
        self.assertEqual(account.title, data['title'])
        self.assertEqual(account.type.id, data['type'])
        self.assertEqual(account.currency.id, data['currency'])
        self.assertEqual(account.owner.id, data['owner'])
        self.assertEqual(account.balance, data['balance'])

        response = self.auth_client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT,
                         'Response code should be 204')
