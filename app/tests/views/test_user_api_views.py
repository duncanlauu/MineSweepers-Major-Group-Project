
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from app.models import User
from app.serializers import RegisterUserSerializer
from app.tests.helpers import LogInTester


class SingleUserTestCase(APITestCase, LogInTester):
    """
    Test case for the GET /users/<id>/ endpoint
    """

    fixtures = ['app/tests/fixtures/default_user.json']

    def setUp(self):
        self.valid_data=  {
            "first_name": "John",
            "last_name": "Doe",
            "username": "johndoe",
            "email": "johndoe@example.org",
            "bio": "Hello, I'm John Doe.",
            "location": "London, UK",
            "birthday": "1980-01-01",
            "created_at": "2013-03-16T17:41:28+00:00",
            "liked_books":[],
            "read_books":[]
        }
        self.invaid_data = {
            "first_name": "",
            "last_name": "Doe",
            "username": "johndoe",
            "email": "johndoe@example.org",
            "bio": "Hello, I'm John Doe.",
            "location": "London, UK",
            "birthday": "1980-01-01",
            "created_at": "2013-03-16T17:41:28+00:00",
            "liked_books":[],
            "read_books":[]
        }

    def test_put_valid_single_user(self):
        response = self.client.put(
            reverse('put_user', kwargs={'id': 1}),
            data=json.dumps(self.valid_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_update_puppy(self):
        response = self.client.put(
            reverse('put_user', kwargs={'id': 1}),
            data=json.dumps(self.invalid_data),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_get_valid_single_user(self):
            response = self.client.get(
                reverse('get_user', kwargs={'id':1}))
            user = User.objects.get(pk=1)
            serializer = RegisterUserSerializer(user)
            self.assertEqual(response.data, serializer.data)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_user(self):
            response = self.client.get(
                reverse('get_user', kwargs={'id':20000}))
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    
    