"""Unit tests for the User model"""
import datetime
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import User, Book, EventVote

class EventVoteModelTest(TestCase):
    """Test the EventVote model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_event_vote.json'
    ]

    def setUp(self):
        self.book = Book.objects.get(title="Harry Potter and the Sorcerer's Stone")
        self.user = User.objects.get(username="johndoe")
        self.eventvote = EventVote.objects.get(user=self.user, book=self.book)

    def test_user_cannot_be_null(self):
        self.eventvote.user = None
        self._assert_event_vote_is_invalid()

    def test_book_cannot_be_null(self):
        self.eventvote.book = None
        self._assert_event_vote_is_invalid()

    def _assert_event_vote_is_valid(self):
        try:
            self.eventvote.full_clean()
        except (ValidationError):
            self.fail('Test user should be valid')

    def _assert_event_vote_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.eventvote.full_clean()    
    