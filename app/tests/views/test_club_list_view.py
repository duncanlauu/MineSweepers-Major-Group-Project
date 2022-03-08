"""Tests of the club list view."""
from django.test import TestCase
from django.urls import reverse
from app.models import User, Club
from app.tests.helpers import LogInTester


class ClubListViewTestCase(TestCase, LogInTester):
    """Tests of the create club view."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json']

    def setUp(self):
        self.url = reverse('club_list')
        self.user = User.objects.get(username='johndoe')
        self.other_user = User.objects.get(username='janedoe')

    def test_club_list_url(self):
        self.assertEqual(self.url, '/club_list/')

    # TODO: implement when there is somewhere to redirect
    # def test_get_club_list_without_logging_in(self):
    #     response = self.client.get(self.url, follow=True)
    #     redirect_url = reverse('dummy')
    #     self.assertRedirects(response, redirect_url, status_code=302, target_status_code=200)
    #     self.assertTemplateUsed(response, 'dummy.html')

    def test_get_club_list_with_login(self):
        self.client.force_login(self.user)
        self._create_test_clubs(10)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'club_list.html')
        self.assertEqual(len(response.context['clubs']), 10)
        for club_id in range(10):
            club = Club.objects.get(name=f'Club {club_id}')
            self.assertEqual(club.description, f'description {club_id}')
            self.assertEqual(club.owner, self.user)
            self.assertTrue(club.visibility)
            self.assertTrue(club.public)

    def test_get_club_list_with_non_visible_clubs(self):
        self.client.force_login(self.user)
        self._create_test_clubs(10, False)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'club_list.html')
        self.assertEqual(len(response.context['clubs']), 0)
        self.assertEqual(len(Club.objects.all()), 10)

    def test_get_club_list_with_visible_clubs(self):
        self.client.force_login(self.user)
        self._create_test_clubs(10)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'club_list.html')
        self.assertEqual(len(response.context['clubs']), 10)
        self.assertEqual(len(Club.objects.all()), 10)

    def test_get_club_list_with_non_visible_and_visible_clubs(self):
        self.client.force_login(self.user)
        self._create_test_clubs(5, True)
        self._create_test_clubs(5, False)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'club_list.html')
        self.assertEqual(len(response.context['clubs']), 5)
        self.assertEqual(len(Club.objects.all()), 10)

    def _create_test_clubs(self, club_count=10, visibility=True):
        for club_id in range(club_count):
            Club.objects.create(
                name=f'Club {club_id}',
                description=f'description {club_id}',
                owner=self.user,
                visibility=visibility,
                public=True,
            )