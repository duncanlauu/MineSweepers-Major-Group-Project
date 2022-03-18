from rest_framework.test import APIClient, APITestCase
from rest_framework.reverse import reverse
from app.models import User, Book, BookRating
from django.forms.models import model_to_dict


class RatingsAPIViewTestCase(APITestCase):
    """Tests of the Book Ratings related API views."""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/others_clubs.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json',
                'app/tests/fixtures/default_book_rating.json',
                'app/tests/fixtures/other_book_ratings.json'
                ]

    def _log_in_helper(self, username, password):
        login_data = {
            "username": username,
            "password": password,
        }
        login_url = "/api/token/"
        response = self.client.post(login_url, login_data, format="json")
        self.assertEqual(response.status_code, 200)
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + access_token)

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.get(pk=1)
        self.book = Book.objects.get(pk="0195153448")

    def test_get_all_ratings_of_user(self):
        self._log_in_helper(self.user.username, 'Password123')
        response = self.client.get(reverse('app:user_ratings'))
        ratings = response.data['ratings']
        rating_count = BookRating.objects.filter(user=self.user).count()
        self.assertEqual(len(ratings), rating_count)
        for rating in ratings:
            self.assertEqual(rating['user'], self.user.id)

    def test_create_new_book_rating(self):
        self._log_in_helper(self.user.username, 'Password123')
        book = Book.objects.get(pk="00000000001")
        rating_data = {'book': book.pk, 'rating': 1}
        book_ratings_before = BookRating.objects.filter(book=book).count()
        response = self.client.post(reverse('app:user_ratings'), rating_data)
        book_ratings_after = BookRating.objects.filter(book=book).count()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(book_ratings_before + 1, book_ratings_after)

    def test_create_duplicate_book_rating(self):
        self._log_in_helper(self.user.username, 'Password123')
        rating_data = {'book': self.book.pk, 'rating': 1}
        book_ratings_before = BookRating.objects.filter(book=self.book).count()
        response = self.client.post(reverse('app:user_ratings'), rating_data)
        book_ratings_after = BookRating.objects.filter(book=self.book).count()
        self.assertEqual(response.status_code, 400)
        self.assertEqual(book_ratings_before, book_ratings_after)

    def test_get_rating_by_id(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(reverse('app:rating', kwargs={'rating_id': 1}))
        self.assertEqual(response.status_code, 200)
        rating = BookRating.objects.get(id=1)
        post_values = model_to_dict(rating, fields=([field.name for field in rating._meta.fields]))
        for k, v in post_values.items():
            self.assertEqual(response.data['rating'][k], v)

    def test_get_rating_with_invalid_id(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(reverse('app:rating', kwargs={'rating_id': 1000}))
        self.assertEqual(response.status_code, 400)

    def test_edit_rating_by_author(self):
        self._log_in_helper(self.user.username, "Password123")
        rating_data = {'rating': 10}
        response = self.client.put(reverse('app:rating', kwargs={'rating_id': 1}), rating_data)
        self.assertEqual(response.status_code, 200)
        rating = BookRating.objects.get(pk=1).rating
        self.assertEqual(rating, 10)

    def test_edit_rating_by_non_author(self):
        non_author = User.objects.get(pk=2)
        self._log_in_helper(non_author.username, "Password123")
        rating_data = {'rating': 10}
        rating_before = BookRating.objects.get(pk=1).rating
        response = self.client.put(reverse('app:rating', kwargs={'rating_id': 1}), rating_data)
        self.assertEqual(response.status_code, 400)
        rating_after = BookRating.objects.get(pk=1).rating
        self.assertEqual(rating_before, rating_after)

    def test_delete_rating_by_author(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.delete(reverse('app:rating', kwargs={'rating_id': 1}))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(BookRating.objects.filter(pk=1).exists())

    def test_delete_rating_by_non_author(self):
        non_author = User.objects.get(pk=2)
        self._log_in_helper(non_author.username, "Password123")
        response = self.client.delete(reverse('app:rating', kwargs={'rating_id': 1}))
        self.assertEqual(response.status_code, 400)
        self.assertTrue(BookRating.objects.filter(pk=1).exists())

    def test_get_rating_by_isbn(self):
        self._log_in_helper(self.user.username, "Password123")
        response = self.client.get(reverse('app:book_ratings', kwargs={'isbn': "0195153448"}))
        ratings = BookRating.objects.filter(book_id='0195153448').count()
        self.assertEqual(ratings, len(response.data['ratings']))

