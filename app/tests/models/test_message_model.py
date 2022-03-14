"""Unit tests for the Club model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Club, Message, User, Book, Chat


class ClubModelTestCase(TestCase):
    """Unit tests for the Club model."""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/default_chat.json',
        'app/tests/fixtures/default_message.json',
        'app/tests/fixtures/other_users.json',
    ]
    # author = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    # content = models.TextField()
    # timestamp = models.DateTimeField(auto_now_add=True)
    def setUp(self):
        self.chat = Chat.objects.get(pk = 1)
        self.message = Message.objects.get(pk = 1)
        self.user = User.objects.get(pk = 1)
        # print(self.chat.messages.all())


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
        pass # needs fixtures
        # second_message = Club.objects.get(name="Jane's Club")
        # self.club.description = second_club.description
        # self._assert_club_is_valid()

    def _assert_message_is_valid(self):
        try:
            self.message.full_clean()
        except (ValidationError):
            self.fail('Test message should be valid')

    def _assert_message_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.message.full_clean()

   
