# """Tests of the user club list view."""
# from django.test import TestCase
# from django.urls import reverse
# from app.models import User, Club
# from app.tests.helpers import LogInTester


# class UserClubListViewTestCase(TestCase, LogInTester):
#     """Tests of the create club view."""

#     fixtures = ['app/tests/fixtures/default_user.json',
#                 'app/tests/fixtures/other_users.json']

#     def setUp(self):
#         self.url = reverse('user_club_list')
#         self.user = User.objects.get(username='johndoe')
#         self.other_user = User.objects.get(username='janedoe')

#     def test_club_list_url(self):
#         self.assertEqual(self.url, '/user_club_list/')

#     # TODO: implement when there is somewhere to redirect
#     # def test_get_user_club_list_without_logging_in(self):
#     #     response = self.client.get(self.url, follow=True)
#     #     redirect_url = reverse('dummy')
#     #     self.assertRedirects(response, redirect_url, status_code=302, target_status_code=200)
#     #     self.assertTemplateUsed(response, 'dummy.html')

#     def test_get_user_club_list_when_user_does_not_belong_to_any_club(self):
#         self.client.force_login(self.user)
#         self._create_test_clubs(0, 10, False, False, False)
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, 200)
#         self.assertTemplateUsed(response, 'club_list.html')
#         self.assertEqual(len(response.context['clubs']), 0)
#         self.assertEqual(len(Club.objects.all()), 10)
#         for club_id in range(10):
#             club = Club.objects.get(name=f'Club {club_id}')
#             self.assertEqual(club.description, f'description {club_id}')
#             self.assertEqual(club.owner, self.other_user)

#     def test_get_user_list_with_owner_login(self):
#         self.client.force_login(self.user)
#         self._create_test_clubs(0, 10, False, False, False)
#         self._create_test_clubs(10, 20, True, False, False)
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, 200)
#         self.assertTemplateUsed(response, 'club_list.html')
#         self.assertEqual(len(response.context['clubs']), 10)
#         self.assertEqual(len(Club.objects.all()), 20)
#         for club_id in range(10, 20):
#             club = Club.objects.get(name=f'Club {club_id}')
#             self.assertEqual(club.description, f'description {club_id}')
#             self.assertEqual(club.owner, self.user)

#     def test_get_user_list_with_admin_login(self):
#         self.client.force_login(self.user)
#         self._create_test_clubs(0, 10, False, False, False)
#         self._create_test_clubs(10, 20, False, True, False)
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, 200)
#         self.assertTemplateUsed(response, 'club_list.html')
#         self.assertEqual(len(response.context['clubs']), 10)
#         self.assertEqual(len(Club.objects.all()), 20)
#         for club_id in range(10, 20):
#             club = Club.objects.get(name=f'Club {club_id}')
#             self.assertEqual(club.description, f'description {club_id}')
#             self.assertEqual(club.owner, self.other_user)
#             self.assertEqual(club.admins.get(username=self.user.username), self.user)

#     def test_get_user_list_with_member_login(self):
#         self.client.force_login(self.user)
#         self._create_test_clubs(0, 10, False, False, False)
#         self._create_test_clubs(10, 20, False, False, True)
#         response = self.client.get(self.url)
#         self.assertEqual(response.status_code, 200)
#         self.assertTemplateUsed(response, 'club_list.html')
#         self.assertEqual(len(response.context['clubs']), 10)
#         self.assertEqual(len(Club.objects.all()), 20)
#         for club_id in range(10, 20):
#             club = Club.objects.get(name=f'Club {club_id}')
#             self.assertEqual(club.description, f'description {club_id}')
#             self.assertEqual(club.owner, self.other_user)
#             self.assertEqual(club.members.get(username=self.user.username), self.user)

#     def _create_test_clubs(self, club_count_LB, club_count_UB, club_owner, club_admin, club_member):
#         owner = self.user if club_owner else self.other_user
#         admin = self.user if club_admin else self.other_user
#         member = self.user if club_member else self.other_user
#         for club_id in range(club_count_LB, club_count_UB):
#             club = Club.objects.create(
#                 name=f'Club {club_id}',
#                 description=f'description {club_id}',
#                 owner=owner,
#             )
#             club.add_admin(admin)
#             club.add_member(member)