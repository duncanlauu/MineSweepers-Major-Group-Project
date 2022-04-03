"""Unit tests for the club recommendation model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import ClubRecommendation


class ClubRecommendationModelTest(TestCase):
    """Test the club recommendation model"""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_club_recommendation.json',
        'app/tests/fixtures/other_clubs.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_books.json',
    ]

    def setUp(self):
        self.club_recommendation = ClubRecommendation.objects.get(pk=1)

    def test_user_cannot_be_none(self):
        self.club_recommendation.user = None
        self._assert_club_recommendation_is_invalid()

    def test_club_cannot_be_none(self):
        self.club_recommendation.club = None
        self._assert_club_recommendation_is_invalid()

    def test_diff_cannot_be_none(self):
        self.club_recommendation.diff = None
        self._assert_club_recommendation_is_invalid()

    def test_method_cannot_be_none(self):
        self.club_recommendation.method = None
        self._assert_club_recommendation_is_invalid()

    def test_method_cannot_be_blank(self):
        self.club_recommendation.method = ''
        self._assert_club_recommendation_is_invalid()

    def test_method_can_have_length_of_50_chars(self):
        self.club_recommendation.method = 50 * 'x'
        self._assert_club_recommendation_is_valid()

    def test_method_cannot_have_length_of_more_than_50_chars(self):
        self.club_recommendation.method = 51 * 'x'
        self._assert_club_recommendation_is_invalid()

    def _assert_club_recommendation_is_valid(self):
        try:
            self.club_recommendation.full_clean()
        except ValidationError:
            self.fail('Test club recommendation should be valid')

    def _assert_club_recommendation_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.club_recommendation.full_clean()
