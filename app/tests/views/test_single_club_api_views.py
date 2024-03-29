import json
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from app.models import Club, User, Book
from app.serializers import ClubSerializer


class SingleClubAPITestCase(TestCase):
    fixtures = ['app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_clubs.json',
        'app/tests/fixtures/other_books.json',
        'app/tests/fixtures/default_chat.json',
        'app/tests/fixtures/default_message.json']

    def setUp(self):
        self.valid_data = {
            'name': 'Joe\'s club but better',
            'description': "This is a club for people who don't like to read science fiction.",
            "created_at": "2015-03-05T20:04:00Z",
            "owner": 1,
            "members": [3],
            "admins": [2],
            "applicants": [5],
            "banned_users": [4],
            "clubs": [1],
            "books": ["0195153448"],
            "visibility": False,
            "public": False
        }

        self.invalid_data = {
            'name': '',
            'description': "This is a club for people who don't like to read science fiction.",
            "created_at": "2015-03-05T20:04:00Z",
            "owner": 1,
            "members": [3],
            "admins": [2],
            "applicants": [5],
            "banned_users": [4],
            "clubs":[1],
            "books": ["0195153448"],
            "visibility": False,
            "public": False
        }
        self.club = Club.objects.get(name="Joe's Club")
        self.owner = User.objects.get(username ="johndoe")
        self.new_user = User.objects.get(username = "jakedoe")
        self.applicant = User.objects.get(username = "jamesdoe")
        self.admin =  User.objects.get(username = "jonathandoe")
        self.member = User.objects.get(username= "janedoe")
        self.banned_user = User.objects.get(username ="juliadoe")
        self.book = Book.objects.get(pk="0380715899")

    def test_get_valid_single_club(self):
        response = self.client.get(
            reverse('app:retrieve_single_club', kwargs={'id': 1}))
        club = Club.objects.get(pk=1)
        serializer = ClubSerializer(club)
        self.assertEqual(response.data['club'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_club(self):
        response = self.client.get(
            reverse('app:retrieve_single_club', kwargs={'id': 20000}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_valid_details_update(self):
        response = self.client.put(
            reverse('app:update_club', kwargs={'id': 1, 'action': 'update'}),
            json.dumps(self.valid_data),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_invalid_details_update(self):
        response = self.client.put(
            reverse('app:update_club', kwargs={'id': 1, 'action': 'update'}),
            json.dumps(self.invalid_data),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_accept_applicant(self):
        before_applicant_count = self.club.applicants.count()
        before_member_count = self.club.members.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 4, 'action': 'accept'}))
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
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 4, 'action': 'reject'}))
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
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 2, 'action': 'remove'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_member_count = self.club.members.count()
        self.assertEqual(after_member_count, before_member_count - 1)
        self.assertFalse(self.club.members.filter(pk=2).exists())

    def test_put_ban_member(self):
        before_member_count = self.club.members.count()
        before_ban_count = self.club.banned_users.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 2, 'action': 'ban'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_member_count = self.club.members.count()
        after_ban_count = self.club.banned_users.count()
        self.assertEqual(after_member_count, before_member_count - 1)
        self.assertEqual(after_ban_count, before_ban_count + 1)
        self.assertFalse(self.club.members.filter(pk=2).exists())
        self.assertTrue(self.member in self.club.banned_users.all())

    def test_put_promote_member(self):
        before_member_count = self.club.members.count()
        before_admin_count = self.club.admins.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 2, 'action': 'promote'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_member_count = self.club.members.count()
        after_admin_count = self.club.admins.count()
        self.assertEqual(after_member_count, before_member_count - 1)
        self.assertEqual(after_admin_count, before_admin_count + 1)
        self.assertFalse(self.club.members.filter(pk=2).exists())
        self.assertTrue(self.member in self.club.admins.all())

    def test_put_demote_admin(self):
        before_admin_count = self.club.admins.count()
        before_member_count = self.club.members.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 3, 'action': 'demote'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_admin_count = self.club.admins.count()
        after_member_count = self.club.members.count()
        self.assertEqual(after_admin_count, before_admin_count - 1)
        self.assertEqual(after_member_count, before_member_count + 1)
        self.assertFalse(self.club.admins.filter(pk=3).exists())
        self.assertTrue(self.member in self.club.members.all())


    def test_put_ban_admin(self):
        before_admin_count = self.club.admins.count()
        before_ban_count = self.club.banned_users.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 3, 'action': 'ban'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_admin_count = self.club.admins.count()
        after_ban_count = self.club.banned_users.count()
        self.assertEqual(after_admin_count, before_admin_count - 1)
        self.assertEqual(after_ban_count, before_ban_count + 1)
        self.assertFalse(self.club.admins.filter(pk=3).exists())
        self.assertTrue(self.admin in self.club.banned_users.all())

    def test_put_unban_user(self):
        before_member_count = self.club.members.count()
        before_unban_count = self.club.banned_users.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 5, 'action': 'unban'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_member_count = self.club.members.count()
        after_unban_count = self.club.banned_users.count()
        self.assertEqual(after_member_count, before_member_count)
        self.assertEqual(after_unban_count, before_unban_count - 1)
        self.assertFalse(self.club.banned_users.filter(pk=5).exists())
        self.assertTrue(self.member in self.club.members.all())

    def test_put_apply_to_club(self):
        before_applicant_count = self.club.applicants.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 6, 'action': 'apply'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        after_applicant_count = self.club.applicants.count()
        self.assertEqual(after_applicant_count, before_applicant_count + 1)
        self.assertTrue(self.applicant in self.club.applicants.all())

    def test_put_transfer_ownership(self):
        new_owner = User.objects.get(pk=3)
        previous_owner = Club.objects.get(pk=1).owner
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 3, 'action': 'transfer'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(previous_owner in self.club.admins.all())
        self.assertEqual(Club.objects.get(pk=1).owner, new_owner)

    def test_put_leave_club_with_member(self):
        before_member_count = self.club.members.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 2, 'action': 'leave'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(self.member in self.club.members.all())
        after_member_count = self.club.members.count()
        self.assertEqual(after_member_count, before_member_count - 1)


    def test_put_leave_club_with_admin(self):
        before_admin_count = self.club.admins.count()
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'user_id': 3, 'action': 'leave'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(self.admin in self.club.admins.all())
        after_admin_count = self.club.admins.count()
        self.assertEqual(after_admin_count, before_admin_count - 1)
    
    def test_invalid_user_put_request(self):
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'action': 'invalid', 'user_id': 20000}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_club_put_request(self):
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 10000, 'action': 'invalid', 'user_id': 4}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_action_put_request(self):
        response = self.client.put(
            reverse('app:manage_club', kwargs={'id': 1, 'action': 'invalid', 'user_id': 4}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_delete(self):
        club_count_before = Club.objects.count()
        response = self.client.delete(reverse('app:retrieve_single_club', kwargs={'id': 1}))
        club_count_after = Club.objects.count()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(club_count_before, club_count_after + 1)

    def test_invalid_delete(self):
        club_count_before = Club.objects.count()
        response = self.client.delete(reverse('app:retrieve_single_club', kwargs={'id': 10}))
        club_count_after = Club.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(club_count_before, club_count_after)
