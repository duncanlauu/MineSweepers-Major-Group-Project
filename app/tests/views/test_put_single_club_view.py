
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from app.models import Club, User
from app.serializers import ClubSerializer
from app.tests.helpers import LogInTester


class PutSingleClubTestCase(TestCase, LogInTester):
    """
    Test case for the GET /users/<id>/ endpoint
    """

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json',]

    def setUp(self):
       self.valid_data = {

       }

       self.invalid_data = {

       }
       self.club = Club.objects.get(pk=1)
       self.applicant = User.objects.get(pk=4)

    def test_put_valid_details_update(self):
        response = self.client.put(
            reverse('put_club', kwargs={'id':1}),
            json.dumps(self.valid_data),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_invalid_details_update(self):
        response = self.client.put(
            reverse('put_club', kwargs={'id':1}),
            json.dumps(self.invalid_data),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_accept_applicant(self):
        before_applicant_count = self.club.applicants.count()
        before_member_count = self.club.members.count()
        response = self.client.put(
            reverse('put_club', kwargs={'id':1, 'user_id':4, 'action':'accept'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_applicant_count = self.club.applicants.count()
        self.assertEqual(after_applicant_count, before_applicant_count - 1)
        after_member_count = self.club.members.count()
        self.assertEqual(after_member_count, before_member_count + 1)
        self.assertFalse(self.club.applicants.filter(pk=4).exists())
        self.assertTrue(self.applicant in self.club.members.all())

    def test_put_reject_applicant(self):
        before_applicant_count = self.club.applicants.count()
        before_member_count = self.club.members.count()
        response = self.client.put(
            reverse('put_club', kwargs={'id':1, 'user_id':4, 'action':'reject'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_applicant_count = self.club.applicants.count()
        self.assertEqual(after_applicant_count, before_applicant_count - 1)
        after_member_count = self.club.members.count()
        self.assertEqual(after_member_count, before_member_count)
        self.assertFalse(self.club.applicants.filter(pk=4).exists())
        self.assertFalse(self.applicant in self.club.members.all())

    def test_put_remove_member(self):
        before_member_count = self.club.members.count()
        response = self.client.put(
            reverse('put_club', kwargs={'id':1, 'user_id':4, 'action':'remove'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_member_count = self.club.members.count()
        self.assertEqual(after_member_count, before_member_count - 1)
        self.assertFalse(self.club.members.filter(pk=4).exists())

    def test_put_ban_member(self):
        before_member_count = self.club.members.count()
        before_ban_count = self.club.banned_users.count()
        response = self.client.put(
            reverse('put_club', kwargs={'id':1, 'user_id':4, 'action':'ban'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_member_count = self.club.members.count()
        after_ban_count = self.club.banned_users.count()
        self.assertEqual(after_member_count, before_member_count - 1)
        self.assertEqual(after_ban_count, before_ban_count + 1)
        self.assertFalse(self.club.members.filter(pk=4).exists())
        self.assertTrue(self.applicant in self.club.banned_users.all())

    def test_put_unban_member(self):
        before_member_count = self.club.members.count()
        before_ban_count = self.club.banned_users.count()
        response = self.client.put(
            reverse('put_club', kwargs={'id':1, 'user_id':4, 'action':'unban'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_member_count = self.club.members.count()
        after_ban_count = self.club.banned_users.count()
        self.assertEqual(after_member_count, before_member_count)
        self.assertEqual(after_ban_count, before_ban_count - 1)
        self.assertFalse(self.club.banned_users.filter(pk=4).exists())
        self.assertTrue(self.applicant in self.club.members.all())

    def test_put_apply_to_club(self):
        before_applicant_count = self.club.applicants.count()
        response = self.client.put(
            reverse('put_club', kwargs={'id':1, 'user_id':6, 'action':'apply'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_applicant_count = self.club.applicants.count()
        self.assertEqual(after_applicant_count, before_applicant_count + 1)
        self.assertTrue(self.applicant in self.club.applicants.all())

    def test_put_transfer_ownership(self):
        before_owner_count = self.club.owners.count()
        new_owner = User.objects.get(pk=3)
        previous_owner = Club.objects.get(pk=1).owner
        response = self.client.put(
            reverse('put_club', kwargs={'id':1, 'user_id':3, 'action':'transfer'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_owner_count = self.club.owners.count()
        self.assertEqual(after_owner_count, before_owner_count)
        self.assertEqual(self.club.owner, new_owner)
        self.assertTrue(previous_owner in self.club.admins.all())


    def test_invalid_put_request(self):
        response = self.client.put(
            reverse('put_club', kwargs={'id':1, 'user_id':4}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        


        

        
        

    