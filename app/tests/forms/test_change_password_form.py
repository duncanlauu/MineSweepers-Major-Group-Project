"""Unit tests of the change password form."""
from app.forms import PasswordForm
from app.models import User
from django import forms
from django.contrib.auth.hashers import check_password
from django.test import TestCase

# Tests taken and modified from clucker
class PasswordFormTestCase(TestCase):
    """Unit tests of the change password form."""

    fixtures = ['app/tests/fixtures/default_user.json']

    def setUp(self):
        self.user = User.objects.get(email='johndoe@example.org')
        self.form_input = {
            'password': 'Password123',
            'new_password': 'NewPassword123',
            'password_confirmation': 'NewPassword123'
        }


    def test_valid_password_form(self):
        form = PasswordForm(user=self.user, data=self.form_input)
        self.assertTrue(form.is_valid())

    def test_form_has_necessary_fields(self):
        form = PasswordForm()
        self.assertIn('password', form.fields)
        password_widget = form.fields['password'].widget
        self.assertTrue(isinstance(password_widget, forms.PasswordInput))
        self.assertIn('new_password', form.fields)
        new_password_widget = form.fields['new_password'].widget
        self.assertTrue(isinstance(new_password_widget, forms.PasswordInput))
        self.assertIn('password_confirmation', form.fields)
        password_confirmation_widget = form.fields['password_confirmation'].widget
        self.assertTrue(isinstance(password_confirmation_widget, forms.PasswordInput))

    def test_password_must_contain_uppercase_character(self):
        self.form_input['new_password'] = 'password123'
        self.form_input['password_confirmation'] = 'password123'
        form = PasswordForm(user=self.user, data=self.form_input)
        self.assertFalse(form.is_valid())

    def test_password_must_contain_lowercase_character(self):
        self.form_input['new_password'] = 'PASSWORD123'
        self.form_input['password_confirmation'] = 'PASSWORD123'
        form = PasswordForm(user=self.user, data=self.form_input)
        self.assertFalse(form.is_valid())

    def test_password_must_contain_number(self):
        self.form_input['new_password'] = 'PasswordABC'
        self.form_input['password_confirmation'] = 'PasswordABC'
        form = PasswordForm(user=self.user, data=self.form_input)
        self.assertFalse(form.is_valid())

    def test_new_password_and_password_confirmation_are_identical(self):
        self.form_input['password_confirmation'] = 'WrongPassword123'
        form = PasswordForm(user=self.user, data=self.form_input)
        self.assertFalse(form.is_valid())

    def test_form_must_update_correctly(self):
        user = User.objects.get(email='johndoe@example.org')
        is_current_password_correct = check_password('Password123', user.password)
        self.assertTrue(is_current_password_correct)
        before_count = User.objects.count()
        user.set_password(self.form_input['new_password'])
        user.save()
        after_count = User.objects.count()
        self.assertEqual(after_count, before_count)
        is_new_password_correct = check_password('NewPassword123', user.password)
        self.assertTrue(is_new_password_correct)

    def test_password_must_be_valid(self):
        self.form_input['password'] = 'WrongPassword123'
        form = PasswordForm(user=self.user, data=self.form_input)
        self.assertFalse(form.is_valid())

    def test_form_must_contain_user(self):
        form = PasswordForm(data=self.form_input)
        self.assertFalse(form.is_valid())

    def test_save_form_changes_password(self):
        form = PasswordForm(user=self.user, data=self.form_input)
        form.full_clean()
        form.save()
        self.user.refresh_from_db()
        self.assertFalse(check_password('Password123', self.user.password))
        self.assertTrue(check_password('NewPassword123', self.user.password))
