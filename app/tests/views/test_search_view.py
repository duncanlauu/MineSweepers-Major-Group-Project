import json

from rest_framework import status
from django.urls import reverse
from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users
from app.models import User, Club
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
        self.user = User.objects.create(
            pk=1276726,
            username='KevinBoy',
            email='kevindoe@example.com',
            first_name='Kevin',
            last_name='Doe',
            bio='this is my bio',
            location='London',
            birthday="1980-01-01",
            password="pbkdf2_sha256$260000$VEDi9wsMYG6eNVeL8WSPqj$LHEiR2iUkusHCIeiQdWS+xQGC9/CjhhrjEOESMMp+c0="
        )
        self.uid = 1276726
        self.client.force_authenticate(user=self.user)
        self.url = reverse('app:search')

    def test_everything(self):
        self._test_get_with_good_query()
        self._test_get_with_gibberish_query()
        self._test_get_with_empty_query()
        self._test_get_with_no_query()

    def _test_get_with_good_query(self):
        response = self.client.get(self.url, {'search_query': 'John'})
        results = json.loads(response.data)
        self.assertLessEqual(len(results['books']), 10)
        self.assertLessEqual(len(results['users']), 10)
        self.assertLessEqual(len(results['clubs']), 10)
        self.assertEqual(len(results['recommended_clubs']), Club.objects.count())
        self.assertEqual(len(results['recommended_users']), 20)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _test_get_with_gibberish_query(self):
        response = self.client.get(self.url, {'search_query': 'dafgshj'})
        # This recommends some clubs even though the search query is gibberish (using user's liked books)
        results = json.loads(response.data)
        self.assertEqual(len(results['books']), 0)
        self.assertEqual(len(results['users']), 0)
        self.assertEqual(len(results['clubs']), 0)
        self.assertEqual(len(results['recommended_clubs']), Club.objects.count())
        self.assertEqual(len(results['recommended_users']), 20)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _test_get_with_empty_query(self):
        response = self.client.get(self.url, {'search_query': ''})
        self.assertEqual(response.data, None)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def _test_get_with_no_query(self):
        response = self.client.get(self.url)
        self.assertEqual(response.data, None)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
