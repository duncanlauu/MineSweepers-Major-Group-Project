"""Unit tests for the Message model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Message


class MessageModelTestCase(TestCase):
    """Unit tests for the Message model."""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_message.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/other_messages.json',
    ]

    def setUp(self):
        self.message = Message.objects.get(pk = 1)

    def test_valid_message(self):
        self._assert_message_is_valid()

    def test_author_cannot_be_none(self):
        self.message.author = None
        self._assert_message_is_invalid()

    def test_content_cannot_be_blank(self):
        self.message.content = ''
        self._assert_message_is_invalid()

    def test_content_can_be_1000_characters_long(self):
        self.message.content = 'x' * 1000
        self._assert_message_is_valid()

    def test_content_cannot_be_over_1000_characters_long(self):
        self.message.content = 'x' * 1001
        self._assert_message_is_invalid()

    def test_content_need_not_be_unique(self):
        second_message = Message.objects.get(pk = 2)
        self.message.content = second_message.content
        self._assert_message_is_valid()

    def _assert_message_is_valid(self):
        try:
            self.message.full_clean()
        except (ValidationError):
            self.fail('Test message should be valid')

    def _assert_message_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.message.full_clean()

   
