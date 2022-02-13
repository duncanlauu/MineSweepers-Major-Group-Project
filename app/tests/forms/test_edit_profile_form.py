"""Unit tests of the sign up form."""
from django.contrib.auth.hashers import check_password
from django import forms
from django.test import TestCase
from app.forms import EditProfileForm
from app.models import User
import datetime

# Class modified from Clucker
class EditProfileFormTestCase(TestCase):
    """Unit tests of the edit profile form."""

    fixtures = ['app/tests/fixtures/default_user.json']

    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        self.form_input = {
            'first_name': 'Jonathan',
            'last_name': 'Doe',
            'username': 'jonathandoe',
            'email': 'jonathan@example.org',
            'bio': 'My bio as Jonathan',
            'location': 'Bristol, UK',
            'birthday': '1992-01-01',
        }


    def test_valid_sign_up_form(self):
        form = EditProfileForm(data=self.form_input)
        self.assertTrue(form.is_valid())

    def test_form_has_necessary_fields(self):
        form = EditProfileForm()
        self.assertIn('first_name', form.fields)
        self.assertIn('last_name', form.fields)
        self.assertIn('username', form.fields)
        self.assertIn('email', form.fields)
        email_field = form.fields['email']
        self.assertTrue(isinstance(email_field, forms.EmailField))
        self.assertIn('bio', form.fields)
        self.assertIn('location', form.fields)
        self.assertIn('birthday', form.fields)


    def test_form_has_initial_values(self):
        form = EditProfileForm(instance=self.user)
        self.assertEqual(form.initial['first_name'], 'John')
        self.assertEqual(form.initial['last_name'], 'Doe')
        self.assertEqual(form.initial['username'], 'johndoe')
        self.assertEqual(form.initial['email'], 'johndoe@example.org')
        self.assertEqual(form.initial['bio'], "Hello, I'm John Doe.")
        self.assertEqual(form.initial['location'], 'London, UK')
        self.assertEqual(form.initial['birthday'], datetime.date(1980, 1, 1) )
        
       
    def test_form_uses_model_validation(self):
        self.form_input['username'] = 'aa' #username too short
        form = EditProfileForm(data=self.form_input)
        self.assertFalse(form.is_valid())

    def test_form_must_save_correctly(self):
        form = EditProfileForm(data=self.form_input, instance=self.user)
        before_count = User.objects.count()
        form.save()
        after_count = User.objects.count()
        self.assertEqual(after_count, before_count)
        user = User.objects.get(username='jonathandoe')
        self.assertEqual(user.first_name, 'Jonathan')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.email, 'jonathan@example.org')
        self.assertEqual(user.bio, 'My bio as Jonathan')
        self.assertEqual(user.location, 'Bristol, UK')
        self.assertEqual(user.birthday, datetime.date(1992, 1, 1))