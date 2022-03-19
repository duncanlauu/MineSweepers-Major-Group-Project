from rest_framework import status
from rest_framework.test import APITestCase
from app.models import User, Chat


class LogInTest(APITestCase):
    """Tests of the login"""
    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
    ]

    login_url = "/api/token/"

    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        self.login_data = {
            "username": self.user.username,
            "password": 'Password123',
        }

    def test_log_in(self):
        login_data = dict(self.login_data)
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # maybe somehow check if actually logged in or not?

    def test_log_in_with_wrong_password(self):
        login_data = dict(self.login_data)
        login_data['password'] = "WrongPassword123"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_log_in_with_wrong_username(self):
        login_data = dict(self.login_data)
        login_data['username'] = "WrongUsername"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_log_in_nonexistentuser(self):
        login_data = dict(self.login_data)
        login_data['username'] = "WrongUsername"
        login_data['password'] = "WrongPassword123"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
