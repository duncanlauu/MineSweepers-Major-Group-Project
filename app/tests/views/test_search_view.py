
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from rest_framework import status
from django.urls import reverse
from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users
from app.models import User
from app.serializers import RegisterUserSerializer
from rest_framework.test import APIClient, APITestCase



class SearchTestCase(APITestCase):

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_recommender_club.json']
                
    def setUp(self):
        # seed_books()
        # seed_users()
        # seed_ratings()
        # seed_clubs()
        self.client = APIClient()
        self.user = User.objects.get(pk=1)
        self.client.force_authenticate(user=self.user)


    def test_get_search(self):
        url = reverse('app:search')
        response = self.client.get(url, {'search_query': 'John'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        



    