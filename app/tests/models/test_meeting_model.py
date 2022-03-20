"""Unit tests for the Meeting model"""
import datetime
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Meeting
from django.utils import timezone


class MeetingModelTest(TestCase):
    """Test the meeting model"""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_meeting.json',
        'app/tests/fixtures/other_meetings.json',

    ]

    def setUp(self):
        self.meeting = Meeting.objects.get(id=1)

    def test_valid_meeting(self):
        self._assert_meeting_is_valid()

    def test_start_time_cannot_be_blank(self):
        self.meeting.start_time = ''
        self._assert_meeting_is_invalid()

    def test_end_time_cannot_be_blank(self):
        self.meeting.end_time = ''
        self._assert_meeting_is_invalid()

    def test_start_time_cannot_be_past_date(self):
        self.meeting.start_time = timezone.now() - timezone.timedelta(days=1)
        self._assert_meeting_is_invalid()

    def test_end_time_cannot_be_past_date(self):
        self.meeting.end_time = timezone.now() - timezone.timedelta(days=1)
        self._assert_meeting_is_invalid()

    def test_discussion_leader_cannot_be_null(self):
        self.meeting.discussion_leader = None
        self._assert_meeting_is_invalid()

    def test_location_may_be_blank(self):
        self.meeting.location = ''
        self._assert_meeting_is_valid()

    def test_location_need_not_be_unique(self):
        second_meeting = Meeting.objects.get(id=2)
        self.meeting.location = second_meeting.location
        self._assert_meeting_is_valid()

    def test_location_may_contain_70_characters(self):
        self.meeting.location = 'x' * 70
        self._assert_meeting_is_valid()

    def test_location_must_not_contain_more_than_70_characters(self):
        self.meeting.location = 'x' * 71
        self._assert_meeting_is_invalid()

    def test_link_may_be_blank(self):
        self.meeting.link = ''
        self._assert_meeting_is_valid()

    def test_link_must_be_unique(self):
        second_meeting = Meeting.objects.get(id=2)
        self.meeting.link = second_meeting.link
        self._assert_meeting_is_invalid()

    def test_link_may_contain_500_characters(self):
        self.meeting.link = 'x' * 500
        self._assert_meeting_is_valid()

    def test_link_must_not_contain_more_than_500_characters(self):
        self.meeting.link = 'x' * 501
        self._assert_meeting_is_invalid()

    def _assert_meeting_is_valid(self):
        try:
            self.meeting.full_clean()
        except (ValidationError):
            self.fail('Test meeting should be valid')

    def _assert_meeting_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.meeting.full_clean()
