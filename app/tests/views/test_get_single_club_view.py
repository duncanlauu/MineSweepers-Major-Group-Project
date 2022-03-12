from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from app.models import Club
from app.serializers import ClubSerializer


class GetSingleClubTestCase(TestCase):
    """
    Test case for the GET /users/<id>/ endpoint
    """

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json', ]

    def test_get_valid_single_club(self):
        response = self.client.get(
            reverse('get_club', kwargs={'id': 1}))
        club = Club.objects.get(pk=1)
        serializer = ClubSerializer(club)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_club(self):
        response = self.client.get(
            reverse('get_club', kwargs={'id': 20000}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
