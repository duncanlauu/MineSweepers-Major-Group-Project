from email.policy import default
from os import access
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APITestCase
from app.models import User, Chat
from app.serializers import ChatSerializer

class PasswordResetTest(APITestCase):

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_chat.json',
                'app/tests/fixtures/other_chats.json',
                ]

    login_url = "/api/token/"
    chat_url = "/api/chat/"
    leave_chat_url = "/api/chat/leave/"


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

    def test_get_invalid_user_chats(self):
        invalid_username = "invalid_username"
        user_chats_url = self.chat_url + f"?username={invalid_username}"
        response = self.client.get(user_chats_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_default_chat(self):
        default_chat_url = self.chat_url + f"{self.default_chat.pk}/"
        response = self.client.get(default_chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = ChatSerializer(self.default_chat)
        self.assertEqual(response.data, serializer.data)

    def test_get_invalid_chat(self):
        invalid_chat_pk = 10
        default_chat_url = self.chat_url + f"{invalid_chat_pk}/"
        response = self.client.get(default_chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_leave_default_chat(self):
        chat_participants = list(self.default_chat.participants.all())
        leave_default_chat_url = self.leave_chat_url + f"{self.default_chat.pk}/"
        login_data = dict(self.login_data)
        login_data["password"] = "Password123"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)
        response = self.client.delete(leave_default_chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_chat_participants = list(self.default_chat.participants.all())
        self.assertTrue(self.user in chat_participants)
        self.assertFalse(self.user in updated_chat_participants)
        self.assertNotEqual(chat_participants, updated_chat_participants)

    def test_leave_chat_user_is_not_in(self):
        chat = Chat.objects.get(pk=2)
        chat_participants = list(chat.participants.all())
        leave_default_chat_url = self.leave_chat_url + f"{chat.pk}/"
        login_data = dict(self.login_data)
        login_data["password"] = "Password123"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)
        response = self.client.delete(leave_default_chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)
        updated_chat_participants = list(chat.participants.all())
        self.assertEqual(chat_participants, updated_chat_participants)
    

