"""Unit tests for the book vote model"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import BookVote


class BookVoteModelTest(TestCase):
    """Test the book vote model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_book_vote.json',
    ]

    def setUp(self):
        self.book_vote = BookVote.objects.get(pk=1)

    def test_valid_book_vote(self):
        try:
            self.book_vote.full_clean()
        except ValidationError:
            self.fail("Time vote should be valid")

    def test_empty_user(self):
        self.book_vote.user = None
        self._assert_invalid_book_vote()

    def test_empty_book(self):
        self.book_vote.book = None
        self._assert_invalid_book_vote()

    def _assert_invalid_book_vote(self):
        with self.assertRaises(ValidationError):
            self.book_vote.full_clean()
