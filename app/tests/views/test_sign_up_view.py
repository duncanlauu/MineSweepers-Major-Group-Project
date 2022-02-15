# """Tests of the sign up view."""
# import datetime
# from django.contrib.auth.hashers import check_password
# from django.test import TestCase
# from django.urls import reverse
# from app.forms import SignUpForm
# from app.models import User
# from app.tests.helpers import LogInTester
# from django.conf import settings
#
# # Class modified from Clucker
# class SignUpViewTestCase(TestCase, LogInTester):
#     """Tests of the sign up view."""
#
#     fixtures = ['app/tests/fixtures/default_user.json']
#
#     def setUp(self):
#         self.url = reverse('sign_up')
#         self.form_input = {
#             'first_name': 'Jane',
#             'last_name': 'Doe',
#             'username': 'janedoe',
#             'email': 'janedoe@example.org',
#             'bio': 'My bio',
#             'location': 'London, UK',
#             'birthday': '2000-01-01',
#             'new_password': 'Password123',
#             'password_confirmation': 'Password123'
#         }
#         self.user = User.objects.get(username='johndoe')
#
#     def test_sign_up_url(self):
#         self.assertEqual(self.url,'/sign_up/')
#
#     def test_get_sign_up(self):
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, 200)
#         self.assertTemplateUsed(response, 'sign_up.html')
#         form = response.context['form']
#         self.assertTrue(isinstance(form, SignUpForm))
#         self.assertFalse(form.is_bound)
#
#     def test_get_sign_up_redirects_when_logged_in(self):
#         self.client.login(username=self.user.username, password="Password123")
#         response = self.client.get(self.url, follow=True)
#         redirect_url = reverse(settings.REDIRECT_URL_WHEN_LOGGED_IN)
#         self.assertRedirects(response, redirect_url, status_code=302, target_status_code=200)
#         self.assertTemplateUsed(response, 'dummy.html')
#
#     def test_unsuccesful_sign_up(self):
#         self.form_input['username'] = 'ba' #bad username (too short)
#         before_count = User.objects.count()
#         response = self.client.post(self.url, self.form_input)
#         after_count = User.objects.count()
#         self.assertEqual(after_count, before_count)
#         self.assertEqual(response.status_code, 200)
#         self.assertTemplateUsed(response, 'sign_up.html')
#         form = response.context['form']
#         self.assertTrue(isinstance(form, SignUpForm))
#         self.assertTrue(form.is_bound)
#         self.assertFalse(self._is_logged_in())
#
#     def test_succesful_sign_up(self):
#         before_count = User.objects.count()
#         response = self.client.post(self.url, self.form_input, follow=True)
#         after_count = User.objects.count()
#         self.assertEqual(after_count, before_count+1)
#         response_url = reverse(settings.REDIRECT_URL_WHEN_LOGGED_IN)
#         self.assertRedirects(response, response_url, status_code=302, target_status_code=200)
#         self.assertTemplateUsed(response, 'dummy.html')
#         user = User.objects.get(username='janedoe')
#         self.assertEqual(user.first_name, 'Jane')
#         self.assertEqual(user.last_name, 'Doe')
#         self.assertEqual(user.email, 'janedoe@example.org')
#         self.assertEqual(user.bio, 'My bio')
#         self.assertEqual(user.location, 'London, UK')
#         self.assertEqual(user.birthday, datetime.date(2000, 1, 1))
#         is_password_correct = check_password('Password123', user.password)
#         self.assertTrue(is_password_correct)
#         self.assertTrue(self._is_logged_in())
#
#     def test_post_sign_up_redirects_when_logged_in(self):
#         self.client.login(username=self.user.username, password="Password123")
#         before_count = User.objects.count()
#         response = self.client.post(self.url, self.form_input, follow=True)
#         after_count = User.objects.count()
#         self.assertEqual(after_count, before_count)
#         redirect_url = reverse(settings.REDIRECT_URL_WHEN_LOGGED_IN)
#         self.assertRedirects(response, redirect_url, status_code=302, target_status_code=200)
#         self.assertTemplateUsed(response, 'dummy.html')
