from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase
from app.models import User, Chat
from app.serializers import ChatSerializer

class PasswordResetTest(APITestCase):

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_chat.json',
                ]

    login_url = "/api/token/"
    chat_url = "/api/chat/"


    def setUp(self):
        self.user = User.objects.get(username='johndoe')
        self.default_chat = Chat.objects.get(pk=1)
        self.login_data = {
            "username": self.user.username,
            "password": self.user.password,
        }
        
        
    def test_get_all_chats(self):
        allChats = Chat.objects.all()
        response = self.client.get(self.chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(allChats))

    def test_get_user_chats(self):
        allUserChats = self.user.chats.all()
        user_chats_url = self.chat_url + f"?username={self.user.username}"
        response = self.client.get(user_chats_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(allUserChats))

    def test_get_default_chat(self):
        default_chat_url = self.chat_url + f"{self.default_chat.pk}"
        response = self.client.get(default_chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = ChatSerializer(self.default_chat)
        self.assertEqual(response.data, serializer.data)

    def test_leave_default_chat(self):
        # print(User.objects.get(username='johndoe').password)
        # leave_default_chat_url = self.chat_url + f"{self.default_chat.pk}/leave"
        # print(User.objects.all())
        # login_data = dict(self.login_data)
        # print(login_data)
        # response = self.client.post(self.login_url, login_data, format="json")
        # print(response.data)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # response = self.client.get(leave_default_chat_url, format="json")
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # serializer = ChatSerializer(self.default_chat)
        # self.assertEqual(response.data, serializer.data)
