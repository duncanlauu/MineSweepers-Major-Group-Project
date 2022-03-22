from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from app.management.commands.seed import seed_books
from app.models import User


class GenresViewTestCase(APITestCase):
    """Tests of the genres API"""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json']

    def setUp(self):
        seed_books()
        self.url = reverse('app:genres')
        self.client.force_authenticate(user=User.objects.get(pk=1))

    def test_everything(self):
        self._test_top_n_genres()
        self._test_top_n_genres_with_no_n()

    def _test_top_n_genres(self):
        response = self.client.get(self.url, {'n': 10})
        results = ['fiction', 'biography & autobiography', 'religion', 'history', 'juvenile nonfiction',
                   'business & economics', 'cooking', 'humor', 'body, mind & spirit', 'health & fitness']
        self.assertEqual(response.data, results)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _test_top_n_genres_with_no_n(self):
        response = self.client.get(self.url)
        self.assertEqual(response.data, 'You need to provide the number of genres you want to get')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
