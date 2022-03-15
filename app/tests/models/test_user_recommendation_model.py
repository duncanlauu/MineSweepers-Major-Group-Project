"""Unit tests for the user recommendation model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import UserRecommendation


class UserRecommendationModelTest(TestCase):
    """Test the user recommendation model"""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_user_recommendation.json',
    ]

    def setUp(self):
        self.user_recommendation = UserRecommendation.objects.get(pk=1)

    def test_user_cannot_be_none(self):
        self.user_recommendation.user = None
        self._assert_user_recommendation_is_invalid()

    def test_user_recommendation_cannot_be_none(self):
        self.user_recommendation.recommended_user = None
        self._assert_user_recommendation_is_invalid()

    def test_diff_cannot_be_none(self):
        self.user_recommendation.diff = None
        self._assert_user_recommendation_is_invalid()

    def test_method_cannot_be_none(self):
        self.user_recommendation.method = None
        self._assert_user_recommendation_is_invalid()

    def test_method_cannot_be_blank(self):
        self.user_recommendation.method = ''
        self._assert_user_recommendation_is_invalid()

    def test_method_can_have_length_of_50_chars(self):
        self.user_recommendation.method = 50 * 'x'
        self._assert_user_recommendation_is_valid()

    def test_method_cannot_have_length_of_more_than_50_chars(self):
        self.user_recommendation.method = 51 * 'x'
        self._assert_user_recommendation_is_invalid()

    def _assert_user_recommendation_is_valid(self):
        try:
            self.user_recommendation.full_clean()
        except ValidationError:
            self.fail('Test user recommendation should be valid')

    def _assert_user_recommendation_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.user_recommendation.full_clean()
