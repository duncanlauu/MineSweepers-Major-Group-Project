"""Unit tests for the voting period model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import VotingPeriod, Book, TimePeriod, Meeting


class VotingPeriodModelTest(TestCase):
    """Test the voting period model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/default_time_period.json',
        'app/tests/fixtures/other_time_periods.json',
        'app/tests/fixtures/other_books.json',
        'app/tests/fixtures/other_book_votes.json',
        'app/tests/fixtures/other_time_votes.json',
        'app/tests/fixtures/default_meeting.json',
        'app/tests/fixtures/default_voting_period.json',
    ]

    def setUp(self):
        self.voting_period = VotingPeriod.objects.get(pk=1)

    def test_time_period_cannot_be_none(self):
        self.voting_period.time_period = None
        self._assert_invalid_voting_period()

    def test_book_votes_can_be_empty(self):
        self.voting_period.book_votes.set([])
        self._assert_valid_voting_period()

    def test_time_votes_can_be_empty(self):
        self.voting_period.time_votes.set([])
        self._assert_valid_voting_period()

    def test_meeting_cannot_be_none(self):
        self.voting_period.meeting = None
        self._assert_invalid_voting_period()

    def test_proposed_books_can_be_empty(self):
        self.voting_period.proposed_books.set([])
        self._assert_valid_voting_period()

    def test_proposed_times_can_be_empty(self):
        self.voting_period.proposed_times.set([])
        self._assert_valid_voting_period()

    def test_get_book_vote(self):
        book = self.voting_period.get_book_vote()
        self.assertEqual(book, Book.objects.get(pk="0380715899"))

    def test_get_time_vote(self):
        time = self.voting_period.get_time_vote()
        self.assertEqual(time, TimePeriod.objects.get(pk=2))

    def test_updating_meeting_works(self):
        meeting = Meeting.objects.get(pk=1)
        meeting.book = None
        meeting.time = None
        meeting.link = ''
        meeting.save()
        try:
            meeting.full_clean()
        except ValidationError:
            self.fail("The meeting should be valid")
        meeting = Meeting.objects.get(pk=1)
        self.assertIsNone(meeting.book)
        self.assertIsNone(meeting.time)
        self.assertEqual(meeting.link, '')
        self.voting_period.fill_in_the_meeting()
        meeting = Meeting.objects.get(pk=1)
        self.assertEqual(meeting.book, Book.objects.get(pk="0380715899"))
        self.assertEqual(meeting.time, TimePeriod.objects.get(pk=2))
        self.assertEqual(meeting.link,
                         'We found that using Zoom or Microsoft Teams is expensive. This link is a fake link (but for free)')
        try:
            meeting.full_clean()
        except ValidationError:
            self.fail("The meeting should be valid")

    def _assert_valid_voting_period(self):
        try:
            self.voting_period.full_clean()
        except ValidationError:
            self.fail("The voting period should be valid")

    def _assert_invalid_voting_period(self):
        with self.assertRaises(ValidationError):
            self.voting_period.full_clean()
