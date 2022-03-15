from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from app.models import User
from app.serializers import RegisterUserSerializer


class GetSingleUserTestCase(TestCase):
    """
    Test case for the GET /users/<id>/ endpoint
    """

    fixtures = ['app/tests/fixtures/default_user.json']

    def test_get_valid_single_user(self):
        response = self.client.get(
            reverse('get_user', kwargs={'id': 1}))
        user = User.objects.get(pk=1)
        serializer = RegisterUserSerializer(user)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_user(self):
        response = self.client.get(
            reverse('get_user', kwargs={'id': 20000}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
