"""Tests of the sign up view."""
from django.contrib.auth.hashers import check_password
from django.test import TestCase
from django.urls import reverse
from app.forms import CreateClubForm
from app.models import User, Club
from app.tests.helpers import LogInTester
from django.conf import settings
from rest_framework import status

class CreateClubViewTestCase(APITestCase, LogInTester):
    """Tests of the create club view."""

    fixtures = ['app/tests/fixtures/default_user.json']

    def setUp(self):
        self.url =reverse('create_club')
        self.form_input = {
            'name': 'Scifi club',
            'description': 'This is a book club for scifi readers',
            'visibility': True,
            'public': True
        }
        self.user = User.objects.get(username='johndoe')
        self.client.force_login(self.user)


    def test_create_club_url(self):
        self.assertEqual(self.url,'/create_club/')

    def test_get_create_club(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'create_club.html')
        form = response.context['form']
        self.assertTrue(isinstance(form, CreateClubForm))
        self.assertFalse(form.is_bound)

    def test_unsuccessful_club_creation(self):
        self.form_input['name'] = ''
        before_count = Club.objects.count()
        response = self.client.post(self.url, self.form_input)
        after_count = Club.objects.count()
        self.assertEqual(after_count, before_count)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    # def test_successful_club_creation(self):
    #     before_count = Club.objects.count()
    #     response = self.client.post(self.url, self.form_input, follow=True)
    #     after_count = Club.objects.count()
    #     self.assertEqual(after_count, before_count+1)
    #     response_url = reverse('dummy')
    #     self.assertRedirects(response, response_url, status_code=302, target_status_code=200)
    #     self.assertTemplateUsed(response, 'dummy.html')
    #     club = Club.objects.get(name='Scifi club')
    #     self.assertEqual(club.owner, self.user)
    #     self.assertEqual(club.description, 'This is a book club for scifi readers')
    #     self.assertEqual(club.visibility, True)
    #     self.assertEqual(club.public, True)
