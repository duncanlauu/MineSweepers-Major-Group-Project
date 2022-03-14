"""Unit tests for the book rating model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import User, Book, BookRating


class BookRatingModelTest(TestCase):
    """Test the book rating model"""

    fixtures = [
        'app/tests/fixtures/default_book_rating.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/default_user.json'
    ]

    def setUp(self):
        self.book = Book.objects.get(pk="0195153448")
        self.user = User.objects.get(username="johndoe")
        self.bookrating = BookRating.objects.get(user=self.user, book=self.book)

    def test_user_cannot_be_null(self):
        self.bookrating.user = None
        self._assert_book_rating_is_invalid()

    def test_book_cannot_be_null(self):
        self.bookrating.book = None
        self._assert_book_rating_is_invalid()

    def test_rating_cannot_be_less_than_1(self):
        self.bookrating.rating = 0
        self._assert_book_rating_is_invalid()

    def test_rating_cannot_be_more_than_10(self):
        self.bookrating.rating = 11
        self._assert_book_rating_is_invalid()

    def _assert_book_rating_is_valid(self):
        try:
            self.bookrating.full_clean()
        except ValidationError:
            self.fail('Test user should be valid')

    def _assert_book_rating_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.bookrating.full_clean()
