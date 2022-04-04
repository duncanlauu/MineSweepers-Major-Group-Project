"""Unit tests for the meeting model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Meeting


class MeetingModelTest(TestCase):
    """Test the meeting model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/default_time_period.json',
        'app/tests/fixtures/other_time_periods.json',
        'app/tests/fixtures/other_books.json',
        'app/tests/fixtures/default_meeting.json',
        'app/tests/fixtures/other_clubs.json',
    ]

    def setUp(self):
        self.meeting = Meeting.objects.get(pk=1)

    def test_name_cannot_be_blank(self):
        self.meeting.name = ''
        self._assert_invalid_meeting()

    def test_name_cannot_be_none(self):
        self.meeting.name = None
        self._assert_invalid_meeting()

    def test_name_can_be_50_char_long(self):
        self.meeting.name = 50 * 'x'
        self._assert_valid_meeting()

    def test_name_cannot_be_over_50_char_long(self):
        self.meeting.name = 51 * 'x'
        self._assert_invalid_meeting()

    def test_description_can_be_blank(self):
        self.meeting.description = ''
        self._assert_valid_meeting()

    def test_description_can_be_none(self):
        self.meeting.description = None
        self._assert_valid_meeting()

    def test_description_can_be_500_char_long(self):
        self.meeting.description = 500 * 'x'
        self._assert_valid_meeting()

    def test_description_cannot_be_over_500_char_long(self):
        self.meeting.description = 501 * 'x'
        self._assert_invalid_meeting()

    def test_club_cannot_be_none(self):
        self.meeting.club = None
        self._assert_invalid_meeting()

    def test_book_can_be_none(self):
        self.meeting.book = None
        self._assert_valid_meeting()

    def test_time_can_be_none(self):
        self.time = None
        self._assert_valid_meeting()

    def test_organiser_cannot_be_none(self):
        self.meeting.organiser = None
        self._assert_invalid_meeting()

    def test_attendees_can_be_empty(self):
        self.meeting.attendees.set([])
        self._assert_valid_meeting()

    def test_link_can_be_blank(self):
        self.meeting.link = ''
        self._assert_valid_meeting()

    def test_link_can_be_500_char_long(self):
        self.meeting.link = 500 * 'x'
        self._assert_valid_meeting()

    def test_link_cannot_be_over_500_char_long(self):
        self.meeting.link = 501 * 'x'
        self._assert_invalid_meeting()

    def _assert_valid_meeting(self):
        try:
            self.meeting.full_clean()
        except ValidationError:
            self.fail("The meeting should be valid")

    def _assert_invalid_meeting(self):
        with self.assertRaises(ValidationError):
            self.meeting.full_clean()
