from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse

from app.models import User, FriendRequest, Chat


class FriendsAPITestCase(APITestCase):

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_friend_request.json',
                'app/tests/fixtures/other_friend_requests.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/other_clubs.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json'
                ]

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.get(pk=1)
        self.client.force_authenticate(self.user)

    def test_get_all_friends(self):
        response = self.client.get(reverse('app:friends'))
        self.assertEqual(response.status_code, 200)
        friends = response.data['friends']
        friends_ids = [friend['id'] for friend in friends]
        self.assertIn(2, friends_ids)
        self.assertIn(3, friends_ids)

    def test_get_all_other_user_friends(self):
        response = self.client.get(reverse('app:other_user_friends', kwargs={'other_user_id': 1}))
        self.assertEqual(response.status_code, 200)
        friend_ids = [friend['id'] for friend in response.data['friends']]
        self.assertIn(2, friend_ids)
        self.assertIn(3, friend_ids)

    def test_delete_friend(self):
        chat_count_before = Chat.objects.count()
        response = self.client.delete(reverse('app:single_friend',
                           kwargs={'other_user_id': 2}))
        deleted_friend = User.objects.get(pk=2)
        chat_count_after = Chat.objects.count()
        self.assertEqual(chat_count_before, chat_count_after)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(deleted_friend not in self.user.friends.all())
        self.assertEqual(self.user.friends.count(), 1)

    def test_get_all_friend_request(self):
        response = self.client.get(reverse('app:friend_requests'))
        self.assertEqual(response.status_code, 200)
        outgoing_requests = response.data['outgoing']
        incoming_requests = response.data['incoming']
        actual_outgoing_count = FriendRequest.objects.filter(sender=self.user).count()
        actual_incoming_count = FriendRequest.objects.filter(receiver=self.user).count()
        outgoing_receiver_ids = [request['receiver'] for request in outgoing_requests]
        incoming_receiver_ids = [request['sender'] for request in incoming_requests]
        self.assertIn(4, outgoing_receiver_ids)
        self.assertNotIn(5, outgoing_receiver_ids)
        self.assertIn(5, incoming_receiver_ids)
        self.assertIn(6, incoming_receiver_ids)
        self.assertIn(7, incoming_receiver_ids)
        self.assertNotIn(8, incoming_receiver_ids)
        self.assertEqual(actual_outgoing_count, len(outgoing_requests))
        self.assertEqual(actual_incoming_count, len(incoming_requests))

    def test_post_friend_request(self):
        friend_request_count_before = FriendRequest.objects.count()
        outgoing_friend_request_count_before = FriendRequest.objects.filter(sender=self.user).count()
        response = self.client.post(reverse('app:friend_requests'), data={'other_user_id': 8})
        friend_request_count_after = FriendRequest.objects.count()
        outgoing_friend_request_count_after = FriendRequest.objects.filter(sender=self.user).count()
        self.assertEqual(friend_request_count_before + 1, friend_request_count_after)
        self.assertEqual(outgoing_friend_request_count_before + 1, outgoing_friend_request_count_after)
        self.assertTrue(FriendRequest.objects.filter(sender=self.user, receiver_id=8).exists())
        self.assertEqual(response.status_code, 200)

    def test_post_friend_request_with_duplicate(self):
        friend_request_count_before = FriendRequest.objects.count()
        outgoing_friend_request_count_before = FriendRequest.objects.filter(sender=self.user).count()
        response = self.client.post(reverse('app:friend_requests'), data={'other_user_id': 4})
        friend_request_count_after = FriendRequest.objects.count()
        outgoing_friend_request_count_after = FriendRequest.objects.filter(sender=self.user).count()
        self.assertEqual(friend_request_count_before, friend_request_count_after)
        self.assertEqual(outgoing_friend_request_count_before, outgoing_friend_request_count_after)
        self.assertEqual(response.status_code, 200)

    def test_post_friend_request_when_already_friends(self):
        friend_request_count_before = FriendRequest.objects.count()
        outgoing_friend_request_count_before = FriendRequest.objects.filter(sender=self.user).count()
        response = self.client.post(reverse('app:friend_requests'), data={'other_user_id': 2})
        friend_request_count_after = FriendRequest.objects.count()
        outgoing_friend_request_count_after = FriendRequest.objects.filter(sender=self.user).count()
        self.assertEqual(friend_request_count_before, friend_request_count_after)
        self.assertEqual(outgoing_friend_request_count_before, outgoing_friend_request_count_after)
        self.assertEqual(response.status_code, 200)

    def test_accept_incoming_friend_request(self):
        friend_count_before = self.user.friends.count()
        chat_count_before = Chat.objects.count()
        response = self.client.delete(reverse('app:friend_requests'), data={'other_user_id': 5, 'action': 'accept'})
        friend_count_after = self.user.friends.count()
        chat_count_after = Chat.objects.count()
        friend = User.objects.get(pk=5)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(friend in self.user.friends.all())
        self.assertTrue(self.user in friend.friends.all())
        self.assertEqual(friend_count_before + 1, friend_count_after)
        self.assertEqual(chat_count_before + 1, chat_count_after)
        self.assertFalse(FriendRequest.objects.filter(sender=friend, receiver=self.user).exists())

    def test_accept_incoming_friend_request_when_already_friends(self):
        friend = User.objects.get(pk=2)
        self.assertTrue(friend in self.user.friends.all())
        self.assertTrue(self.user in friend.friends.all())
        friend_count_before = self.user.friends.count()
        friend_request_count_before = FriendRequest.objects.count()
        response = self.client.delete(reverse('app:friend_requests'), data={'other_user_id': 2, 'action': 'accept'})
        friend_count_after = self.user.friends.count()
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(friend_count_before, friend_count_after)
        self.assertEqual(friend_request_count_before, friend_request_count_after)

    def test_accept_incoming_friend_request_with_non_existing_request(self):
        user = User.objects.get(pk=8)
        friend_request_count_before = FriendRequest.objects.count()
        self.assertFalse(FriendRequest.objects.filter(sender_id=8).exists())
        response = self.client.delete(reverse('app:friend_requests'), data={'other_user_id': 8, 'action': 'accept'})
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(friend_request_count_before, friend_request_count_after)
        self.assertFalse(user in self.user.friends.all())
        self.assertFalse(self.user in user.friends.all())

    def test_reject_incoming_friend_request(self):
        friend_count_before = self.user.friends.count()
        chat_count_before = Chat.objects.count()
        friend_request_count_before = FriendRequest.objects.count()
        response = self.client.delete(reverse('app:friend_requests'), data={'other_user_id': 5, 'action': 'reject'})
        friend_count_after = self.user.friends.count()
        chat_count_after = Chat.objects.count()
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(friend_count_before, friend_count_after)
        self.assertEqual(chat_count_before, chat_count_after)
        self.assertEqual(friend_request_count_before - 1, friend_request_count_after)
        self.assertFalse(FriendRequest.objects.filter(sender_id=5, receiver=self.user).exists())

    def test_cancel_outgoing_friend_request(self):
        friend_request_count_before = FriendRequest.objects.count()
        response = self.client.delete(reverse('app:friend_requests'), data={'other_user_id': 4, 'action': 'cancel'})
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(friend_request_count_before - 1, friend_request_count_after)
        self.assertFalse(FriendRequest.objects.filter(sender=self.user, receiver_id=4).exists())

    def test_friend_view_delete_with_invalid_id(self):
        friend_count_before = self.user.friends.count()
        response = self.client.delete(reverse('app:single_friend', kwargs={'other_user_id': 1000}))
        friend_count_after = self.user.friends.count()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(friend_count_before, friend_count_after)

    def test_friend_request_view_post_with_invalid_user(self):
        outgoing_friend_request_count_before = FriendRequest.objects.filter(sender=self.user).count()
        response = self.client.post(reverse('app:friend_requests'), data={'other_user_id': 1000})
        outgoing_friend_request_count_after = FriendRequest.objects.filter(sender=self.user).count()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(outgoing_friend_request_count_before, outgoing_friend_request_count_after)

    def test_friend_request_view_delete_with_invalid_user(self):
        friend_request_count_before = FriendRequest.objects.count()
        response = self.client.delete(reverse('app:friend_requests'), data={'other_user_id': 1000})
        friend_request_count_after = FriendRequest.objects.count()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(friend_request_count_before, friend_request_count_after)
