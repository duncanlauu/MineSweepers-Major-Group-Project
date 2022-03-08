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

    # def test_reset_password(self):
    #     # reset password
    #     data = {"email": self.user.email}
    #     response = self.client.post(self.send_reset_password_email_url, data, format="json")
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    #     # parse reset-password email to get uid and token
    #     # it is a second email!
    #     email_lines = mail.outbox[0].body.splitlines()
    #     reset_link = [l for l in email_lines if "/password_reset_confirm/" in l][0]
    #     uid, token = reset_link.split("/")[-2:]
    #     #
    #     # # confirm reset password
    #     data = {"uid": uid, "token": token, "new_password": "new_verysecret", "re_new_password": "new_verysecret"}
    #     response = self.client.post(self.confirm_reset_password_url, data, format="json")
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     #
    #     # # login to get the authentication token with old password
    #     response = self.client.post(self.login_url, self.login_data, format="json")
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #     #
    #     # # login to get the authentication token with new password
    #     login_data = dict(self.login_data)
    #     login_data["password"] = "new_verysecret"
    #     response = self.client.post(self.login_url, login_data, format="json")
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

    # # Test case based on: https://saasitive.com/tutorial/django-rest-framework-reset-password/
    # def test_reset_password_wrong_email(self):
    #     data = {"email": "wrong@email.com"}
    #     response = self.client.post(self.send_reset_password_email_url, data, format="json")
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     # the email wasnt send
    #     self.assertEqual(len(mail.outbox), 0)
