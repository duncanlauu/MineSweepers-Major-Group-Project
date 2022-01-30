"""Tests of the log out view."""
from django.test import TestCase
from django.urls import reverse
from app.models import User
from app.tests.helpers import LogInTester

# Class modified from Cluckers
class LogOutViewTestCase(TestCase, LogInTester):
    """Tests of the log out view."""

    fixtures = ['app/tests/fixtures/default_user.json']

    def setUp(self):
        self.url = reverse('log_out')
        self.user = User.objects.get(username='johndoe')

    def test_log_out_url(self):
        self.assertEqual(self.url,'/log_out/')

    def test_get_log_out(self):
        self.client.login(username='johndoe', password='Password123')
        self.assertTrue(self._is_logged_in())
        response = self.client.get(self.url, follow=True)
        response_url = reverse('home')
        self.assertRedirects(response, response_url, status_code=302, target_status_code=200)
        self.assertTemplateUsed(response, 'home.html')
        self.assertFalse(self._is_logged_in())

    def test_get_log_out_without_being_logged_in(self):
        response = self.client.get(self.url, follow=True)
        response_url = reverse('home')
        self.assertRedirects(response, response_url, status_code=302, target_status_code=200)
        self.assertTemplateUsed(response, 'home.html')
        self.assertFalse(self._is_logged_in())
