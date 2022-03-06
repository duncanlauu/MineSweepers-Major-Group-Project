
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from app.models import Club
from app.serializers import ClubSerializer
from app.tests.helpers import LogInTester


class GetSingleClubTestCase(TestCase, LogInTester):
    """
    Test case for the GET /users/<id>/ endpoint
    """

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/others_clubs.json']

    def test_get_valid_single_club(self):
            response = self.client.get(
                reverse('clubs'))
            print (response.data)

    # def test_get_invalid_single_club(self):
    #         response = self.client.get(
    #             reverse('get_club', kwargs={'id':20000}))
    #         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)