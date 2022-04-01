import json
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse

from app.models import User
from app.serializers import RegisterUserSerializer


class SingleUserTestCase(APITestCase):
    """
    Test case for the GET /users/<id>/ endpoint
    """

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_friend_request.json']

    def setUp(self):
        self.valid_data = {
            "first_name": "John",
            "last_name": "Doe",
            "username": "johndoe",
            "email": "johndoe@example.org",
            "bio": "Hello, I'm John Doe.",
            "location": "London, UK",
            "birthday": "1980-01-01",
            "created_at": "2013-03-16T17:41:28+00:00",
            "password": "Password123",
            "liked_books": [],
            "read_books": []
        }
        self.invalid_data = {
            "first_name": "",
            "last_name": "Doe",
            "username": "johndoe",
            "email": "johndoe@example.org",
            "bio": "Hello, I'm John Doe.",
            "location": "London, UK",
            "birthday": "1980-01-01",
            "created_at": "2013-03-16T17:41:28+00:00",
            "liked_books": [],
            "read_books": []
        }
        self.client = APIClient()
        self.user = User.objects.get(pk=1)
        self.client.force_authenticate(self.user)

    def test_put_valid_single_user(self):
        response = self.client.put(
            reverse('app:get_update', kwargs={'id': 1}),
            data=json.dumps(self.valid_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_invalid_single_user(self):
        response = self.client.put(
            reverse('app:get_update', kwargs={'id': 1}),
            data=json.dumps(self.invalid_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_invalid_single_user(self):
        response = self.client.post(reverse('app:create_user'), self.invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_valid_single_user(self):
        response = self.client.get(reverse('app:get_update', kwargs={'id': 1}))
        user = User.objects.get(pk=1)
        serializer = RegisterUserSerializer(user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        del response.data['user_sent_request']
        del response.data['user_is_friends']
        self.assertEqual(response.data, serializer.data)

    def test_get_invalid_single_user(self):
        response = self.client.get(
            reverse('app:get_update', kwargs={'id': 20000}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_user_is_friends_with_self(self):
        response = self.client.get(reverse('app:get_update', kwargs={'id': self.user.id}))
        user = User.objects.get(pk=1)
        serializer = RegisterUserSerializer(user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['user_sent_request'])
        self.assertFalse(response.data['user_is_friends'])
        del response.data['user_sent_request']
        del response.data['user_is_friends']
        self.assertEqual(response.data, serializer.data)

    def test_get_user_is_friends_with_other_user(self):
        response = self.client.get(reverse('app:get_update', kwargs={'id': 2}))
        user = User.objects.get(pk=2)
        serializer = RegisterUserSerializer(user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['user_sent_request'])
        self.assertTrue(response.data['user_is_friends'])
        del response.data['user_sent_request']
        del response.data['user_is_friends']
        self.assertEqual(response.data, serializer.data)

    def test_get_user_sent_friend_request_to_other_user(self):
        response = self.client.get(reverse('app:get_update', kwargs={'id': 4}))
        user = User.objects.get(pk=4)
        serializer = RegisterUserSerializer(user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['user_sent_request'])
        self.assertFalse(response.data['user_is_friends'])
        del response.data['user_sent_request']
        del response.data['user_is_friends']
        self.assertEqual(response.data, serializer.data)

    def test_get_user_with_no_requests_and_is_not_friend(self):
        response = self.client.get(reverse('app:get_update', kwargs={'id': 5}))
        user = User.objects.get(pk=5)
        serializer = RegisterUserSerializer(user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['user_sent_request'])
        self.assertFalse(response.data['user_is_friends'])
        del response.data['user_sent_request']
        del response.data['user_is_friends']
        self.assertEqual(response.data, serializer.data)