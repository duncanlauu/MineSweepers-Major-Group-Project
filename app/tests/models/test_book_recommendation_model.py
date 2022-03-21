"""Unit tests for the book recommendation model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import BookRecommendation


class BookRecommendationModelTest(TestCase):
    """Test the book recommendation model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_book_recommendation.json',
    ]

    def setUp(self):
        self.book_recommendation = BookRecommendation.objects.get(pk=1)

    def test_user_cannot_be_none(self):
        self.book_recommendation.user = None
        self._assert_book_recommendation_is_invalid()

    def test_book_cannot_be_none(self):
        self.book_recommendation.book = None
        self._assert_book_recommendation_is_invalid()

    def test_rating_cannot_be_none(self):
        self.book_recommendation.rating = None
        self._assert_book_recommendation_is_invalid()

    def test_genre_cannot_be_none(self):
        self.book_recommendation.genre = None
        self._assert_book_recommendation_is_invalid()

    def test_genre_cannot_be_blank(self):
        self.book_recommendation.genre = ''
        self._assert_book_recommendation_is_invalid()

    def test_genre_can_have_length_of_50_chars(self):
        self.book_recommendation.genre = 50 * 'x'
        self._assert_book_recommendation_is_valid()

    def test_genre_cannot_have_length_of_more_than_50_chars(self):
        self.book_recommendation.genre = 51 * 'x'
        self._assert_book_recommendation_is_invalid()

    def _assert_book_recommendation_is_valid(self):
        try:
            self.book_recommendation.full_clean()
        except ValidationError:
            self.fail('Test book recommendation should be valid')

    def _assert_book_recommendation_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.book_recommendation.full_clean()
