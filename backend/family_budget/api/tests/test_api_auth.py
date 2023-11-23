from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from users.models import User


class ApiUserAuthTest(APITestCase):
    @classmethod
    def setUpClass(cls):
        cls.urls = {
            'login': '/api/v1/auth/token/login/',
            'logout': '/api/v1/auth/token/logout/',
            'transaction_type': '/api/v1/transaction-type/'
        }
        cls.password = "P@ssw0rd1"
        super().setUpClass()

    def setUp(self):
        self.user = User.objects.create_user(
            username="User1",
            email="user1@test.com",
            password=self.password
        )
        self.data = {
            'password': self.password,
            'email': self.user.email
        }

    def test_token(self):
        response = self.client.post(self.urls['login'], self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        self.assertTrue(response.data['auth_token'],
                        'Token shoud not be empty')

        token = Token.objects.get(user=self.user)
        self.assertEqual(response.data['auth_token'], token.key,
                         'Fetched token is not equals saved')

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.urls['logout'])
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT,
                         'Response code shold be 204')

        with self.assertRaises(Token.DoesNotExist):
            Token.objects.get(key=token.key)

    def test_access_with_token(self):
        self.client.post(self.urls['login'], self.data)

        token = Token.objects.get(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(self.urls['transaction_type'])
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code shold be 200')

    def test_access_without_token(self):
        response = self.client.get(self.urls['transaction_type'])
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED,
                         'Response code shold be 401')
