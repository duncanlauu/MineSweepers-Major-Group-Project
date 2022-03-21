"""Unit tests for the User model"""
import datetime
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import User, Book, ClubEvent

class ClubEventModelTest(TestCase):
    """Test the club_event model"""

    fixtures = [
        
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_books.json',
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/others_clubs.json',
        'app/tests/fixtures/default_event_vote.json',
        'app/tests/fixtures/other_event_votes.json',
        'app/tests/fixtures/default_club_event.json',
        'app/tests/fixtures/default_club_event.json',
        'app/tests/fixtures/default_vote.json',
        'app/tests/fixtures/other_votes.json',
        'app/tests/fixtures/default_meeting.json',
        'app/tests/fixtures/other_meetings.json',
        'app/tests/fixtures/default_club_event',
        'app/tests/fixtures/other_club_events.json',
        
    ]

    def setUp(self):
        self.club_event = ClubEvent.objects.get(id=1)

    def test_club_cannot_be_null(self):
        self.club_event.club_id = None
        self._assert_club_event_is_invalid()

    def test_book_cannot_be_null(self):
        self.club_event.book = None
        self._assert_club_event_is_invalid()

    def test_voting_time_cannot_be_null(self):
        self.club_event.voting_time = None
        self._assert_club_event_is_invalid()

    def test_meeting_cannot_be_null(self):
        self.club_event.meeting = None
        self._assert_club_event_is_invalid()

    def test_description_can_be_blank(self):
        self.club_event.description = ''
        self._assert_club_event_is_valid()

    def test_description_can_be_500_characters_long(self):
        self.club_event.description = 'x' * 500
        self._assert_club_event_is_valid()

    def test_description_cannot_be_over_500_characters_long(self):
        self.club_event.description = 'x' * 501
        self._assert_club_event_is_invalid()

    def test_description_need_not_be_unique(self):
        second_club_event = ClubEvent.objects.get(id=2)
        self.club_event.description = second_club_event.description
        self._assert_club_event_is_valid()

    

    def _assert_club_event_is_valid(self):
        try:
            self.club_event.full_clean()
        except (ValidationError):
            self.fail('Test club event should be valid')

    def _assert_club_event_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.club_event.full_clean()    
    