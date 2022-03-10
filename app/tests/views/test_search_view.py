from rest_framework import status
from django.urls import reverse
from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users
from app.models import User
from rest_framework.test import APIClient, APITestCase


class SearchTestCase(APITestCase):

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/others_clubs.json']
                
    def setUp(self):
        seed_books()
        seed_users()
        seed_ratings()
        seed_clubs()
        self.client = APIClient()
        self.user = User.objects.get(pk=1)
        self.client.force_authenticate(user=self.user)

    def test_get_search(self):
        url = reverse('app:search')
        response = self.client.get(url, {'search_query': 'John'})
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, {'search_query': 'dafgshj'})
        # This recommends some clubs even though the search query is gibberish (using user's liked books)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url, {'search_query': ''})
        self.assertEqual(response.data, None)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.get(url)
        self.assertEqual(response.data, None)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
