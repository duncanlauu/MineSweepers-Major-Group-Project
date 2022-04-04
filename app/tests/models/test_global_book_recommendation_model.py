"""Unit tests for the global book recommendation model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import GlobalBookRecommendation


class BookRecommendationModelTest(TestCase):
    """Test the global book recommendation model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/default_global_book_recommendation.json'
    ]

    def setUp(self):
        self.global_book_recommendation = GlobalBookRecommendation.objects.get(pk=1)

    def test_book_cannot_be_none(self):
        self.global_book_recommendation.book = None
        self._assert_global_book_recommendation_is_invalid()

    def test_weighted_rating_cannot_be_none(self):
        self.global_book_recommendation.weighted_rating = None
        self._assert_global_book_recommendation_is_invalid()

    def test_number_of_ratings_cannot_be_none(self):
        self.global_book_recommendation.number_of_ratings = None
        self._assert_global_book_recommendation_is_invalid()

    def test_flat_rating_cannot_be_none(self):
        self.global_book_recommendation.flat_rating = None
        self._assert_global_book_recommendation_is_invalid()

    def test_genre_cannot_be_none(self):
        self.global_book_recommendation.genre = None
        self._assert_global_book_recommendation_is_invalid()

    def test_genre_cannot_be_blank(self):
        self.global_book_recommendation.genre = ''
        self._assert_global_book_recommendation_is_invalid()

    def test_genre_can_have_length_of_50_chars(self):
        self.global_book_recommendation.genre = 50 * 'x'
        self._assert_global_book_recommendation_is_valid()

    def test_genre_cannot_have_length_of_more_than_50_chars(self):
        self.global_book_recommendation.genre = 51 * 'x'
        self._assert_global_book_recommendation_is_invalid()

    def _assert_global_book_recommendation_is_valid(self):
        try:
            self.global_book_recommendation.full_clean()
        except ValidationError:
            self.fail('Test global book recommendation should be valid')

    def _assert_global_book_recommendation_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.global_book_recommendation.full_clean()
