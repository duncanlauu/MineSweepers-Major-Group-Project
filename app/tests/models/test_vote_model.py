"""Unit tests for the Club model."""
import datetime
from time import timezone
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Club, User, Book, Vote, EventVote
from django.utils import timezone


class VoteModelTestCase(TestCase):
    """Unit tests for the Club model."""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_books.json',
        'app/tests/fixtures/default_vote.json',
        'app/tests/fixtures/default_event_vote.json',
        'app/tests/fixtures/other_event_votes.json'
    ]

    def setUp(self):
        self.new_event_vote = EventVote.objects.get(id=2)
        self.vote = Vote.objects.get(id=1)

    def test_valid_vote(self):
        self._assert_vote_is_valid()

    def test_add_event_vote(self):
        self.assertEqual(self.vote.event_vote.count(), 1)
        self.vote.add_event_vote(self.new_event_vote)
        self.assertEqual(self.vote.event_vote.count(), 2)

    def test_remove_event_vote(self):
        self.vote.add_event_vote(self.new_event_vote)
        self.assertEqual(self.vote.event_vote.count(), 2)
        self.vote.remove_event_vote(self.new_event_vote)
        self.assertEqual(self.vote.event_vote.count(), 1)

    def test_event_vote_count(self):
        self.assertEqual(self.vote.event_vote_count(), self.vote.event_vote.count())
        self.vote.add_event_vote(self.new_event_vote)
        self.assertEqual(self.vote.event_vote_count(), self.vote.event_vote.count())

    def test_start_time_cannot_be_blank(self):
        self.vote.start_time = ''
        self._assert_vote_is_invalid()

    def test_start_time_cannot_be_past_date(self):
        self.vote.start_time = timezone.now() - timezone.timedelta(days=1)
        self._assert_vote_is_invalid()

    def test_end_time_cannot_be_blank(self):
        self.vote.end_time = ''
        self._assert_vote_is_invalid()

    def test_end_time_cannot_be_past_date(self):
        self.vote.end_time = timezone.now() - timezone.timedelta(days=1)
        self._assert_vote_is_invalid()
        

    def _assert_vote_is_valid(self):
        try:
            self.vote.full_clean()
        except (ValidationError):
            self.fail('Test event vote should be valid')

    def _assert_vote_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.vote.full_clean()

   
