"""Tests of the accept applicant view."""
from django.test import TestCase
from django.urls import reverse
from app.models import User, Club
from app.tests.helpers import LogInTester


class AcceptApplicantViewTestCase(TestCase, LogInTester):
    """Tests of the create club view."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/default_book.json']

    def setUp(self):
        self.club = Club.objects.get(name="Joe's Club")
        self.applicant = User.objects.get(username='jamesdoe')
        self.url = reverse('accept_applicant', kwargs={'club_id': self.club.id, 'applicant_id': self.applicant.id})

    def test_accept_applicant_url(self):
        self.assertEqual(self.url, f'/accept_applicant/{self.club.id}/{self.applicant.id}')

    def test_accept_applicant_with_owner_permissions(self):
        owner = User.objects.get(username='johndoe')
        self.client.force_login(owner)
        applications_before = self.club.applicants.count()
        member_count_before = self.club.members.count()
        response = self.client.get(self.url, follow=True)
        applications_after = self.club.applicants.count()
        member_count_after = self.club.members.count()
        self.assertEqual(applications_before, applications_after + 1)
        self.assertEqual(member_count_before, member_count_after - 1)
        self.assertFalse(self.club.applicants.filter(username=self.applicant.username).exists())
        self.assertTrue(self.club.members.filter(username=self.applicant.username).exists())
        # TODO: test for correct redirect when successful


    def test_accept_applicant_with_admin_permissions(self):
        admin = User.objects.get(username='jonathandoe')
        self.client.force_login(admin)
        applications_before = self.club.applicants.count()
        member_count_before = self.club.members.count()
        response = self.client.get(self.url, follow=True)
        applications_after = self.club.applicants.count()
        member_count_after = self.club.members.count()
        self.assertEqual(applications_before, applications_after)
        self.assertEqual(member_count_before, member_count_after)
        self.assertTrue(self.club.applicants.filter(username=self.applicant.username).exists())
        self.assertFalse(self.club.members.filter(username=self.applicant.username).exists())

    def test_accept_applicant_with_member_permissions(self):
        member = User.objects.get(username='janedoe')
        self.client.force_login(member)
        applications_before = self.club.applicants.count()
        member_count_before = self.club.members.count()
        response = self.client.get(self.url, follow=True)
        applications_after = self.club.applicants.count()
        member_count_after = self.club.members.count()
        self.assertEqual(applications_before, applications_after)
        self.assertEqual(member_count_before, member_count_after)
        self.assertTrue(self.club.applicants.filter(username=self.applicant.username).exists())
        self.assertFalse(self.club.members.filter(username=self.applicant.username).exists())

    def test_accept_applicant_with_no_permissions(self):
        no_permission_user = User.objects.get(username='jakedoe')
        self.client.force_login(no_permission_user)
        applications_before = self.club.applicants.count()
        member_count_before = self.club.members.count()
        response = self.client.get(self.url, follow=True)
        applications_after = self.club.applicants.count()
        member_count_after = self.club.members.count()
        self.assertEqual(applications_before, applications_after)
        self.assertEqual(member_count_before, member_count_after)
        self.assertTrue(self.club.applicants.filter(username=self.applicant.username).exists())
        self.assertFalse(self.club.members.filter(username=self.applicant.username).exists())

    # TODO: add error checking in view
    # def test_accept_applicant_with_invalid_applicant_id(self):
    #     pass
    #
    # def test_accept_applicant_with_invalid_club_id(self):
    #     pass