from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase
from app.models import User, Chat

class PasswordResetTest(APITestCase):

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_chat.json',
                ]

    login_url = "/api/token/"
    chat_list_url = "/api/chat/"
    chat_url = "/api//"
    chat_leave_url = "/api//"


    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        self.login_data = {
            "username": self.user.username,
            "password": self.user.password,
        }
        
    def test_get_all_chats(self):
        print(Chat.objects.all())
        response = self.client.get(self.chat_list_url, format="json")
        print(response.content)
        pass