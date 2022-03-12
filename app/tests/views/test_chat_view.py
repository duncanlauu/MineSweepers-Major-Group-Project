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

    def test_get_default_chat(self):
        default_chat_url = self.chat_url + f"{self.default_chat.pk}/"
        response = self.client.get(default_chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = ChatSerializer(self.default_chat)
        self.assertEqual(response.data, serializer.data)
        print(response.data)

    def test_leave_default_chat(self):

        # self.client.force_login(self.user)
        # print(User.objects.get(username='johndoe').password)
        leave_default_chat_url = self.leave_chat_url + f"{self.default_chat.pk}/"
        # print(User.objects.all())
        login_data = dict(self.login_data)
        login_data["password"] = "Password123"
        # print(login_data)
        response = self.client.post(self.login_url, login_data, format="json")
        print(response.data['access'])
        access_token = response.data['access']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)

        response = self.client.delete(leave_default_chat_url, format="json")
        print(response)

        # actually works MADD

        
        # response = self.client.get(
        #         reverse('chat/1/', kwargs={'id':1}))
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # serializer = ChatSerializer(self.default_chat)
        # self.assertEqual(response.data, serializer.data)
