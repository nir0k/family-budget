
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from currency.models import Currency
from users.models import User


class ApiCurrencyTest(APITestCase):
    @classmethod
    def setUpClass(cls):
        cls.url = '/api/v1/currency/'
        super().setUpClass()

    def setUp(self):
        user = User.objects.create_user(
            username="User1",
            email="user1@test.com",
            password="P@ssw0rd1"
        )
        self.token = Token.objects.create(user=user)
        self.usd = Currency.objects.create(
            title='US Dollar',
            code='USD'
        )
        self.unauth_client = self.client
        self.auth_client = APIClient()
        self.auth_client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.token.key
        )

    def test_GetCurrencyWithoutToken(self):
        response = self.unauth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED,
                         'Response code shold be 401')

    def test_GetCurrencyWitToken(self):
        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code shold be 200')
        response_data = response.json()
        self.assertEqual(response_data[0]['title'], self.usd.title)
        self.assertEqual(response_data[0]['code'], self.usd.code)

    def test_PostEditDeleteCurrency(self):
        data = {
            'title': 'Euro',
            'code': 'EUR'
        }
        response = self.auth_client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED,
                         'Response code should be 201')
        self.assertEqual(response.data['title'], data['title'])
        self.assertEqual(response.data['code'], data['code'])
        currency = Currency.objects.get(code=data['code'])
        self.assertEqual(currency.code, data['code'])
        self.assertEqual(currency.title, data['title'])

        data = {
            'title': 'Euro test'
        }
        url = self.url + f'{response.data["id"]}/'
        response = self.auth_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        self.assertEqual(response.data['title'], data['title'])
        currency = Currency.objects.get(code='EUR')
        self.assertEqual(currency.title, data['title'])

        data = {
            'title': 'Euro test 2',
            'code': 'EUR'
        }
        response = self.auth_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        self.assertEqual(response.data['title'], data['title'])
        self.assertEqual(response.data['code'], data['code'])
        currency = Currency.objects.get(code=data['code'])
        self.assertEqual(currency.code, data['code'])
        self.assertEqual(currency.title, data['title'])

        response = self.auth_client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT,
                         'Response code should be 204')
