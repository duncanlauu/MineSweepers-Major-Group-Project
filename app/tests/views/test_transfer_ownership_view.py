# """Tests of the transfer ownership view."""
# from django.test import TestCase
# from django.urls import reverse
# from app.models import User, Club
# from app.tests.helpers import LogInTester


# class TransferOwnershipViewTestCase(TestCase, LogInTester):

#     """Tests of the transfer ownership view."""

#     fixtures = ['app/tests/fixtures/default_user.json',
#                 'app/tests/fixtures/other_users.json',
#                 'app/tests/fixtures/default_club.json',
#                 'app/tests/fixtures/default_book.json']

#     def setUp(self):
#         self.club = Club.objects.get(name="Joe's Club")
#         self.owner = User.objects.get(username='johndoe')
#         self.url = reverse('transfer_ownership', kwargs={'club_id': self.club.id, 'new_owner_id': self.owner.id})

#     def generate_url(self, user_id):
#         return f'/transfer_ownership/{self.club.id}/{user_id}'

#     def test_club_list_url(self):
#         self.assertEqual(self.url, f'/transfer_ownership/{self.club.id}/{self.owner.id}')

#     def test_transfer_ownership_to_admin_user1(self):
#         admin = User.objects.get(username='jonathandoe')
#         self.client.force_login(self.owner)
#         response = self.client.get(self.generate_url(admin.id))
#         updated_club = Club.objects.get(name="Joe's Club")
#         self.assertEqual(updated_club.owner, admin)
#         self.assertTrue(updated_club.admins.filter(id=self.owner.id).exists())
#         self.assertFalse(updated_club.admins.filter(id=admin.id).exists())
#         self.assertFalse(updated_club.members.filter(id=admin.id).exists())

#     def test_transfer_ownership_to_member_user(self):
#         member = User.objects.get(username='janedoe')
#         self.client.force_login(self.owner)
#         response = self.client.get(self.generate_url(member.id))
#         updated_club = Club.objects.get(name="Joe's Club")
#         self.assertEqual(updated_club.owner, member)
#         self.assertTrue(updated_club.admins.filter(id=self.owner.id).exists())
#         self.assertFalse(updated_club.admins.filter(id=member.id).exists())
#         self.assertFalse(updated_club.members.filter(id=member.id).exists())

#     def test_transfer_ownership_to_owner(self):
#         self.client.force_login(self.owner)
#         response = self.client.get(self.generate_url(self.owner.id))
#         updated_club = Club.objects.get(name="Joe's Club")
#         self.assertEqual(updated_club.owner, self.owner)
#         self.assertFalse(updated_club.admins.filter(id=self.owner.id).exists())
#         self.assertFalse(updated_club.admins.filter(id=self.owner.id).exists())
#         self.assertFalse(updated_club.members.filter(id=self.owner.id).exists())

#     def test_transfer_ownership_with_admin_status(self):
#         admin = User.objects.get(username='jonathandoe')
#         member = User.objects.get(username='janedoe')
#         self.client.force_login(admin)
#         response = self.client.get(self.generate_url(member.id))
#         updated_club = Club.objects.get(name="Joe's Club")
#         self.assertEqual(updated_club.owner, self.owner)
#         self.assertTrue(updated_club.admins.filter(id=admin.id).exists())
#         self.assertTrue(updated_club.members.filter(id=member.id).exists())

#     def test_transfer_ownership_with_member_status(self):
#         member = User.objects.get(username='janedoe')
#         admin = User.objects.get(username='jonathandoe')
#         self.client.force_login(member)
#         response = self.client.get(self.generate_url(admin.id))
#         updated_club = Club.objects.get(name="Joe's Club")
#         self.assertEqual(updated_club.owner, self.owner)
#         self.assertTrue(updated_club.admins.filter(id=admin.id).exists())
#         self.assertTrue(updated_club.members.filter(id=member.id).exists())

#     # def test_transfer_ownership_with_invalid_user_id(self):
#     #     pass
#     #
#     # def test_transfer_ownership_with_invalid_club_id(self):
#     #     pass