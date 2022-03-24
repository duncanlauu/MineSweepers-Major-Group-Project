import json
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from app.models import Book, User
from app.serializers import BookSerializer


class BookAPITestCase(APITestCase):

    fixtures = ['app/tests/fixtures/default_user.json',
    'app/tests/fixtures/other_users.json',
    'app/tests/fixtures/default_book.json']

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.get(username='johndoe')
        self.client.force_authenticate(user=self.user)

    def test_get_valid_book(self):
        response = self.client.get(
            reverse('app:retrieve_book', kwargs={'ISBN': "0195153448"}))
        book = Book.objects.get(pk="0195153448")
        serializer = BookSerializer(book)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_book(self):
        response = self.client.get(
            reverse('app:retrieve_book', kwargs={'ISBN': "20000"}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)