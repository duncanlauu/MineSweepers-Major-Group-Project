from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from app.models import User



class FeedAPIViewTestCase(APITestCase):
    """Tests of the Feed related API views."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_post.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/default_book.json',]

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.get(pk=1)
        self.client.force_authenticate(self.user)

    def test_get_post(self):
        response = self.client.get(reverse('app:post', kwargs={'post_id': 1}))
        print(response.data)
