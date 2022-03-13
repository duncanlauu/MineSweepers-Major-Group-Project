from django.urls import reverse
from app.models import User
from rest_framework.test import APITestCase


class CreateClubViewTestCase(APITestCase):
    """Tests of the create club view."""

    fixtures = ['app/tests/fixtures/default_user.json']

    def setUp(self):
        self.url = reverse('create_club')
        self.form_input = {
            'name': 'Scifi club',
            'description': 'This is a book club for scifi readers',
            'visibility': True,
            'public': True
        }
        self.user = User.objects.get(username='johndoe')
        self.client.force_login(self.user)
