"""Tests of the password reset view"""
from django.test import TestCase
from django.urls import reverse
from app.models import User
from app.tests.helpers import reverse_with_next
from django.contrib.auth.forms import PasswordResetForm

class PasswordResetViewTestCase(TestCase):
    """Tests of the password reset view."""

    fixtures = ['app/tests/fixtures/default_user.json']

    def setUp(self):
        self.url = reverse('password_reset')
        self.user = User.objects.get(username='johndoe')

    def test_password_reset_url(self):
        self.assertEqual(self.url,'/password_reset/')

    def test_get_password_reset(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'password_reset_templates/password_reset.html')
        form = response.context['form']
        self.assertTrue(isinstance(form, PasswordResetForm))
        self.assertFalse(form.is_bound)
