"""Tests of the apply club view."""
from django.test import TestCase
from django.urls import reverse
from app.models import User, Club
from app.tests.helpers import LogInTester


class ApplyClubViewTestCase(TestCase, LogInTester):

    """Tests of the transfer ownership view."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/default_book.json']

    def setUp(self):
        self.club = Club.objects.get(name="Joe's Club")
        self.url = reverse('apply_club', kwargs={'club_id': self.club.id})

    def test_apply_club_url(self):
        self.assertEqual(self.url, f'/apply_club/{self.club.id}')

    def test_successful_apply_club(self):
        user = User.objects.get(username='jakedoe')
        self.client.force_login(user)
        club_applicant_count_before = self.club.applicants.count()
        response = self.client.get(self.url)
        club_applicant_count_after = self.club.applicants.count()
        self.assertEqual(club_applicant_count_before + 1, club_applicant_count_after)
        self.assertTrue(self.club.applicants.filter(id=user.id).exists())


    def test_apply_club_when_user_is_member(self):
        member = User.objects.get(username='janedoe')
        self.client.force_login(member)
        club_applicant_count_before = self.club.applicants.count()
        response = self.client.get(self.url)
        club_applicant_count_after = self.club.applicants.count()
        self.assertEqual(club_applicant_count_before, club_applicant_count_after)
        self.assertTrue(self.club.members.filter(id=member.id).exists())
        self.assertFalse(self.club.applicants.filter(id=member.id).exists())

    def test_apply_club_when_user_is_admin(self):
        admin = User.objects.get(username='jonathandoe')
        self.client.force_login(admin)
        club_applicant_count_before = self.club.applicants.count()
        response = self.client.get(self.url)
        club_applicant_count_after = self.club.applicants.count()
        self.assertEqual(club_applicant_count_before, club_applicant_count_after)
        self.assertTrue(self.club.admins.filter(id=admin.id).exists())
        self.assertFalse(self.club.applicants.filter(id=admin.id).exists())

    def test_apply_club_when_user_is_banned(self):
        banned_user = User.objects.get(username='juliadoe')
        self.client.force_login(banned_user)
        club_applicant_count_before = self.club.applicants.count()
        response = self.client.get(self.url)
        club_applicant_count_after = self.club.applicants.count()
        self.assertEqual(club_applicant_count_before, club_applicant_count_after)
        self.assertTrue(self.club.banned_users.filter(id=banned_user.id).exists())
        self.assertFalse(self.club.applicants.filter(id=banned_user.id).exists())

    # TODO: redirect when page is available
    # def test_apply_club_with_invalid_club_id(self):
    #     pass
    #
    # def test_apply_club_with_invalid_user_id(self):
    #     pass
