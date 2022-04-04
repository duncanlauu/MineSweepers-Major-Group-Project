from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from django.db import transaction, IntegrityError

from app.models import Club, User, Chat
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
        serializer = ClubSerializer([self.joeClub], many=True)
        serializer_with_email = serializer.data
        for club in serializer_with_email:
            club['owner_email'] = User.objects.get(pk=club['owner']).email
        self.assertEqual(response.data, serializer_with_email)

    def test_correct_get_more_clubs(self):
        self.jakeClub.visibility = True
        self.jakeClub.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = ClubSerializer([self.joeClub, self.jakeClub], many=True)
        serializer_with_email = serializer.data
        for club in serializer_with_email:
            club['owner_email'] = User.objects.get(pk=club['owner']).email
        self.assertEqual(response.data, serializer_with_email)

    def test_correct_post(self):
        club_count_before = Club.objects.count()
        chat_count_before = Chat.objects.count()
        response = self.client.post(self.url, data={"name": "This is a name", "description": "This is a description"})
        club_count_after = Club.objects.count()
        chat_count_after = Chat.objects.count()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "This is a name")
        self.assertEqual(response.data['description'], "This is a description")
        self.assertEqual(Club.objects.get(name="This is a name").owner, self.user)
        self.assertEqual(club_count_after, club_count_before + 1)
        self.assertEqual(chat_count_after, chat_count_before + 1)

    def test_club_post_with_blank_name(self):
        club_count_before = Club.objects.count()
        response = self.client.post(self.url, data={"name": "", "description": "This is a description"})
        club_count_after = Club.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(club_count_after, club_count_before)

    def test_club_post_with_long_name(self):
        club_count_before = Club.objects.count()
        long_name = "This is a name" * 100
        data = {"name": long_name, "description": "This is a description"}
        response = self.client.post(self.url, data=data)
        club_count_after = Club.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(club_count_after, club_count_before)

    def test_post_with_duplicate_club_name(self):
        try:
            self.assertTrue(Club.objects.filter(name=self.joeClub.name).exists())
            club_count_before = Club.objects.count()
            with transaction.atomic():
                data = {"name": self.joeClub.name, "description": "This is a description"}
                response = self.client.post(self.url, data=data)
            club_count_after = Club.objects.count()
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(club_count_after, club_count_before)
            self.assertEqual(Club.objects.filter(name=self.joeClub.name).count(), 1)
        except IntegrityError:
            self.fail("IntegrityError raised")

    def test_get_clubs_of_valid_user(self):
        response = self.client.get(reverse('app:user_clubs', kwargs={'user_id': 2}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, ClubSerializer([self.joeClub, self.janeClub], many=True).data)

    def test_get_clubs_on_user_that_is_not_in_any_clubs(self):
        response = self.client.get(reverse('app:user_clubs', kwargs={'user_id': 8}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_get_clubs_of_invalid_user(self):
        response = self.client.get(reverse('app:user_clubs', kwargs={'user_id': 500}))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, 'User is invalid')
