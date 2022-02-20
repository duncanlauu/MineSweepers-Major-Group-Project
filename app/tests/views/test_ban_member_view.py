"""Tests of the ban member view."""
from django.test import TestCase
from django.urls import reverse
from app.models import User, Club
from app.tests.helpers import LogInTester


class BanMemberViewTestCase(TestCase, LogInTester):
    """Tests of the create club view."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/default_book.json']

    def setUp(self):
        self.club = Club.objects.get(name="Joe's Club")
        self.banned_member = User.objects.get(username='janedoe')
        self.url = reverse('ban_member', kwargs={'club_id': self.club.id, 'member_id': self.banned_member.id})

    def test_ban_member_url(self):
        self.assertEqual(self.url, f'/ban_member/{self.club.id}/{self.banned_member.id}')

    def test_ban_member_with_owner_permissions(self):
        owner = User.objects.get(username='johndoe')
        self.client.force_login(owner)
        banned_members_before = self.club.banned_users.count()
        member_count_before = self.club.members.count()
        response = self.client.get(self.url, follow=True)
        banned_members_after = self.club.banned_users.count()
        member_count_after = self.club.members.count()
        self.assertEqual(banned_members_before + 1, banned_members_after)
        self.assertEqual(member_count_before - 1, member_count_after)
        self.assertTrue(self.club.banned_users.filter(username=self.banned_member.username).exists())
        self.assertFalse(self.club.members.filter(username=self.banned_member.username).exists())
        # TODO: test for correct redirect when successful

    def test_ban_member_with_admin_permissions(self):
        admin = User.objects.get(username='jonathandoe')
        self.client.force_login(admin)
        banned_members_before = self.club.banned_users.count()
        member_count_before = self.club.members.count()
        response = self.client.get(self.url, follow=True)
        banned_members_after = self.club.banned_users.count()
        member_count_after = self.club.members.count()
        self.assertEqual(banned_members_before, banned_members_after)
        self.assertEqual(member_count_before, member_count_after)
        self.assertFalse(self.club.banned_users.filter(username=self.banned_member.username).exists())
        self.assertTrue(self.club.members.filter(username=self.banned_member.username).exists())

    def test_ban_member_with_member_permissions(self):
        member = User.objects.get(username='janedoe')
        self.client.force_login(member)
        banned_members_before = self.club.banned_users.count()
        member_count_before = self.club.members.count()
        response = self.client.get(self.url, follow=True)
        banned_members_after = self.club.banned_users.count()
        member_count_after = self.club.members.count()
        self.assertEqual(banned_members_before, banned_members_after)
        self.assertEqual(member_count_before, member_count_after)
        self.assertFalse(self.club.banned_users.filter(username=self.banned_member.username).exists())
        self.assertTrue(self.club.members.filter(username=self.banned_member.username).exists())

    def test_ban_member_with_no_permissions(self):
        no_permission_user = User.objects.get(username='jakedoe')
        self.client.force_login(no_permission_user)
        banned_members_before = self.club.banned_users.count()
        member_count_before = self.club.members.count()
        response = self.client.get(self.url, follow=True)
        banned_members_after = self.club.banned_users.count()
        member_count_after = self.club.members.count()
        self.assertEqual(banned_members_before, banned_members_after)
        self.assertEqual(member_count_before, member_count_after)
        self.assertFalse(self.club.banned_users.filter(username=self.banned_member.username).exists())
        self.assertTrue(self.club.members.filter(username=self.banned_member.username).exists())

    # TODO: add error checking in view
    # def test_ban_member_with_invalid_applicant_id(self):
    #     pass
    #
    # def test_ban_member_with_invalid_club_id(self):
    #     pass