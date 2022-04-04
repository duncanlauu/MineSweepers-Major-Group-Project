"""Unit tests for the time period model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import TimePeriod


class TimePeriodModelTest(TestCase):
    """Test the time period model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_time_period.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/other_clubs.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_books.json',
    ]

    def setUp(self):
        self.time_period = TimePeriod.objects.get(pk=1)

    def test_valid_time_period(self):
        try:
            self.time_period.full_clean()
        except ValidationError:
            self.fail("Time period should be valid")

    def test_empty_start_time(self):
        self.time_period.start_time = None
        self._assert_invalid_time_period()

    def test_empty_end_time(self):
        self.time_period.end_time = None
        self._assert_invalid_time_period()

    def _assert_invalid_time_period(self):
        with self.assertRaises(ValidationError):
            self.time_period.full_clean()
