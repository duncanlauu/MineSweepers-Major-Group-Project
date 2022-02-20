"""Unit tests of the club form."""
from django import forms
from django.test import TestCase
from app.forms import CreateClubForm
from app.models import User, Club

class ClubFormTestCase(TestCase):
    """Unit tests of the club form."""

    fixtures = ['app/tests/fixtures/default_user.json']

    def setUp(self):
        self.form_input = {
            'name': 'Scifi club',
            'description': 'This is a book club for scifi readers',
            'visibility': True,
            'public': True
        }
        self.user = User.objects.get(username='johndoe')

    def test_valid_club_form_form(self):
        form = CreateClubForm(data=self.form_input)
        self.assertTrue(form.is_valid())

    def test_form_has_necessary_fields(self):
        form = CreateClubForm()
        self.assertIn('name', form.fields)
        self.assertIn('description', form.fields)
        self.assertIn('visibility', form.fields)
        self.assertIn('public', form.fields)

    def test_form_uses_model_validation(self):
        self.form_input['name'] = '' #username is blank
        form = CreateClubForm(data=self.form_input)
        self.assertFalse(form.is_valid())

    def test_club_form_must_save_correctly(self):
        form = CreateClubForm(data=self.form_input)
        before_count = Club.objects.count() 
        form.save(self.user)
        after_count = Club.objects.count()
        self.assertEqual(after_count, before_count+1)
        club = Club.objects.get(name = 'Scifi club')
        self.assertEqual(club.owner, self.user)
        self.assertEqual(club.description, 'This is a book club for scifi readers')
        self.assertEqual(club.visibility, True)
        self.assertEqual(club.public, True)

