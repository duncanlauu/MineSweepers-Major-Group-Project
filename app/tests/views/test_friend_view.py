from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse

from app.models import User


class FriendsAPITestCase(APITestCase):

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json']

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
        self.assertIn(4, friends_ids)

    def test_delete_friend(self):
        response = self.client.delete(reverse('app:single_friend',
                           kwargs={'other_user_id': 2}))
        deleted_friend = User.objects.get(pk=2)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(deleted_friend not in self.user.friends.all())
        self.assertEqual(self.user.friends.count(), 2)
    