"""Unit tests for the Chat model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Chat, Message, User


class ChatModelTestCase(TestCase):
    """Unit tests for the Chat model."""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_chat.json',
        'app/tests/fixtures/default_message.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/other_chats.json',
        'app/tests/fixtures/other_messages.json',
    ]

    def setUp(self):
        self.chat = Chat.objects.get(pk=1)
        self.new_user = User.objects.get(pk=2)
        self.new_message = Message.objects.get(pk=2)

    def test_valid_chat(self):
        self._assert_chat_is_valid()

    def test_name_can_be_blank(self):
        self.chat.name = ''
        self._assert_chat_is_valid()

    def test_name_can_be_50_characters_long(self):
        self.chat.name = 'x' * 50
        self._assert_chat_is_valid()

    def test_name_cannot_be_over_50_characters_long(self):
        self.chat.name = 'x' * 51
        self._assert_chat_is_invalid()

    def test_name_need_not_be_unique(self):
        second_chat = Chat.objects.get(pk=2)
        self.chat.name = second_chat.name
        self._assert_chat_is_valid()

    def test_group_chat_defaults_to_false(self):
        new_chat = Chat.objects.create()
        self.assertFalse(new_chat.group_chat)

    def test_add_message(self):
        self.assertEqual(self.chat.messages.count(), 1)
        self.chat.messages.add(self.new_message)
        self.assertEqual(self.chat.messages.count(), 2)

    def test_add_participant(self):
        self.assertEqual(self.chat.participants.count(), 1)
        self.chat.participants.add(self.new_user)
        self.assertEqual(self.chat.participants.count(), 2)

    def test_remove_participant(self):
        self.chat.participants.add(self.new_user)
        self.assertEqual(self.chat.participants.count(), 2)
        self.chat.participants.remove(self.new_user)
        self.assertEqual(self.chat.participants.count(), 1)

    def _assert_chat_is_valid(self):
        try:
            self.chat.full_clean()
        except ValidationError:
            self.fail('Test chat should be valid')

    def _assert_chat_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.chat.full_clean()
