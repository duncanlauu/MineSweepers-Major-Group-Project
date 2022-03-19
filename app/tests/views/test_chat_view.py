from rest_framework import status
from rest_framework.test import APITestCase
from app.models import User, Chat


class ChatViewTest(APITestCase):
    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_chat.json',
        'app/tests/fixtures/default_message.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/other_chats.json',
        'app/tests/fixtures/other_messages.json',
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

    def test_get_all_chats_without_specifying_user(self):
        login_data = dict(self.login_data)
        login_data["password"] = "Password123"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)
        response = self.client.get(self.chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_logged_in_user_chats(self):
        user_chats = self.user.chats.all()
        login_data = dict(self.login_data)
        login_data["password"] = "Password123"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)
        user_chats_url = self.chat_url + f"?username={self.user.username}"
        response = self.client.get(user_chats_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(user_chats))

    def test_get_user_chats_while_not_logged_in(self):
        user_chats_url = self.chat_url + f"?username={self.user.username}"
        response = self.client.get(user_chats_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_other_users_chats(self):
        invalid_username = "otheruser_username"  # not the logged in user
        login_data = dict(self.login_data)
        login_data["password"] = "Password123"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)

        user_chats_url = self.chat_url + f"?username={invalid_username}"
        response = self.client.get(user_chats_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

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

    def test_leave_default_chat_while_not_logged_in(self):
        chat_participants = list(self.default_chat.participants.all())
        leave_default_chat_url = self.leave_chat_url + f"{self.default_chat.pk}/"
        response = self.client.delete(leave_default_chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        updated_chat_participants = list(self.default_chat.participants.all())
        self.assertTrue(self.user in chat_participants)
        self.assertTrue(self.user in updated_chat_participants)
        self.assertEqual(chat_participants, updated_chat_participants)

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

    def test_leave_nonexistent_chat(self):
        chat_pk = 10
        leave_default_chat_url = self.leave_chat_url + f"{chat_pk}/"
        login_data = dict(self.login_data)
        login_data["password"] = "Password123"
        response = self.client.post(self.login_url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)
        response = self.client.delete(leave_default_chat_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
