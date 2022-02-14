"""Tests of the edit profile view."""
from django.test import TestCase
from django.urls import reverse
from app.forms import EditProfileForm
from app.models import User
from app.tests.helpers import LogInTester
import datetime

class EditProfileViewTestCase(TestCase, LogInTester):
    """Tests of the edit profile view."""

    fixtures = ['app/tests/fixtures/default_user.json']
    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        self.url = reverse('edit_profile')
        self.form_input = {
            'first_name': 'Jonathan',
            'last_name': 'Doe',
            'username': 'jonathandoe',
            'email': 'jonathan@example.org',
            'bio': 'My bio as Jonathan',
            'location': 'Bristol, UK',
            'birthday': '1992-01-01',
        }
        self.client.login(username=self.user.username, password="Password123")
        

    #might need to review
    def test_profile_edit_url(self):
        self.assertEqual(self.url,'/edit_profile/')

    def test_get_profile_edit(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'edit_profile.html')#get proper user_id
        form = response.context['form']
        self.assertTrue(isinstance(form, EditProfileForm))
        self.assertFalse(form.is_bound)

    def test_unsuccesful_profile_edit(self):
        self.form_input['username'] = ''
        before_count = User.objects.count()
        response = self.client.post(self.url, self.form_input)
        after_count = User.objects.count()
        self.assertEqual(after_count, before_count)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'edit_profile.html')
        form = response.context['form']        
        self.assertTrue(isinstance(form, EditProfileForm))
        self.assertFalse(form.is_bound)
        self.assertTrue(self._is_logged_in())

    def test_succesful_profile_edit(self):
        before_count = User.objects.count()
        response = self.client.post(self.url, self.form_input, follow=True)
        after_count = User.objects.count()
        self.assertEqual(after_count, before_count)
        response_url = reverse('dummy')
        self.assertRedirects(response, response_url, status_code=302, target_status_code=200)
        self.assertTemplateUsed(response, 'dummy.html')
        user = User.objects.get(username='jonathandoe')
        self.assertEqual(user.first_name, 'Jonathan')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.email, 'jonathan@example.org')
        self.assertEqual(user.bio, 'My bio as Jonathan')
        self.assertEqual(user.location, 'Bristol, UK')
        self.assertEqual(user.birthday, datetime.date(1992, 1, 1))
        self.assertTrue(self._is_logged_in())
