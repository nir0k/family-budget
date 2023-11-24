from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from budget.models import Family
from users.models import User


class ApiFamilyTest(APITestCase):
    def setUp(self):
        self.url = '/api/v1/family/'
        self.user1 = User.objects.create_user(
            username="User1",
            email="user1@test.com",
            password="P@ssw0rd1"
        )
        self.user2 = User.objects.create_user(
            username="User2",
            email="user2@test.com",
            password="P@ssw0rd2"
        )
        self.user3 = User.objects.create_user(
            username="User3",
            email="user3@test.com",
            password="P@ssw0rd3"
        )
        self.token = Token.objects.create(user=self.user1)
        self.unauth_client = self.client
        self.auth_client = APIClient()
        self.auth_client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.token.key
        )

    def test_Family(self):
        data = {
            'title': 'Amazing Family',
            'members': [self.user1.id, self.user2.id]
        }
        response = self.auth_client.post(self.url, data)
        print(f'user1: {self.user1.id}, '
              f'user2: {self.user2.id}, user3: {self.user3.id}')
        print(f'self.url: {self.url}')
        print(f'data: {data}')
        print(f'response: {response}')
        print(f'response code: {response.status_code}')
        print(f'response data: {response.data}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED,
                         'Response code should be 201')
        id = response.data['id']
        self.assertEqual(response.data['title'], data['title'])
        self.assertEqual(response.data['members'], data['members'])
        family = Family.objects.get(pk=id)
        self.assertEqual(family.title, data['title'])
        self.assertEqual(
            list(family.members.all().values_list('id', flat=True)),
            data['members'])

        response = self.auth_client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code shold be 200')
        self.assertEqual(response.data['results'][0]['title'], data['title'])
        self.assertEqual(response.data['results'][0]['members'],
                         data['members'])

        data = {
            'title': 'Amazing Family2',
            'members': [self.user1.id, self.user3.id]
        }
        url = self.url + f'{id}/'
        response = self.auth_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        id = response.data['id']
        self.assertEqual(response.data['title'], data['title'])
        self.assertEqual(response.data['members'], data['members'])
        family = Family.objects.get(pk=id)
        self.assertEqual(family.title, data['title'])
        self.assertEqual(
            list(family.members.all().values_list('id', flat=True)),
            data['members'])

        data = {
            'title': 'Amazing Family',
            'members': [self.user1.id]
        }
        response = self.auth_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         'Response code should be 200')
        id = response.data['id']
        self.assertEqual(response.data['title'], data['title'])
        self.assertEqual(response.data['members'], data['members'])
        family = Family.objects.get(pk=id)
        self.assertEqual(family.title, data['title'])
        self.assertEqual(
            list(family.members.all().values_list('id', flat=True)),
            data['members'])

        response = self.auth_client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT,
                         'Response code should be 204')
