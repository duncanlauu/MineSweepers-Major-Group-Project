from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from app.models import Club, User
from app.serializers import ClubSerializer


class ClubsTestCase(APITestCase):
    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/other_clubs.json']

    def setUp(self):
        self.user = User.objects.get(pk=1)
        self.joeClub = Club.objects.get(pk=1)
        self.janeClub = Club.objects.get(pk=2)
        self.jakeClub = Club.objects.get(pk=3)
        self.clubs = [self.joeClub, self.janeClub, self.jakeClub]
        self.url = reverse('app:clubs')
        self.client.force_authenticate(user=self.user)

    def test_correct_get_one_club(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ClubSerializer([self.joeClub], many=True).data)

    def test_correct_get_more_clubs(self):
        self.jakeClub.visibility = True
        self.jakeClub.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ClubSerializer([self.joeClub, self.jakeClub], many=True).data)

    def test_correct_post(self):
        club_count_before = Club.objects.count()
        response = self.client.post(self.url, data={"name": "This is a name", "description": "This is a description"})
        club_count_after = Club.objects.count()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "This is a name")
        self.assertEqual(response.data['description'], "This is a description")
        self.assertEqual(Club.objects.get(name="This is a name").owner, self.user)
        self.assertEqual(club_count_after, club_count_before + 1)

    def test_incorrect_post(self):
        club_count_before = Club.objects.count()
        response = self.client.post(self.url, data={"name": "", "description": "This is a description"})
        club_count_after = Club.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(club_count_after, club_count_before)
