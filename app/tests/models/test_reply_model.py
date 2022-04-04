"""Unit tests for the Reply model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Club, User, Book, Post, Comment, Reply


class ReplyModelTestCase(TestCase):
    """Unit tests for the Reply model."""
    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/other_clubs.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_books.json',
        'app/tests/fixtures/default_post.json',
        'app/tests/fixtures/other_posts.json',
        'app/tests/fixtures/default_comment.json',
        'app/tests/fixtures/other_comments.json',
        'app/tests/fixtures/default_reply.json',
        'app/tests/fixtures/other_replies.json',
    ]

    def setUp(self):
        self.user = User.objects.get(pk=1)
        self.reply = Reply.objects.get(pk=1)

    def test_reply_content_cannot_be_blank(self):
        self.reply.content = ''
        self._assert_reply_is_invalid()

    def test_reply_content_can_be_500_characters_long(self):
        self.reply.content = "x" * 500
        self._assert_reply_is_valid()

    def test_reply_content_cannot_be_over_500_characters_long(self):
        self.reply.content = "x" * 501
        self._assert_reply_is_invalid()

    def test_reply_author_cannot_be_none(self):
        self.reply.author = None
        self._assert_reply_is_invalid()

    def test_reply_cannot_have_an_empty_comment_fk(self):
        self.reply.comment = None
        self._assert_reply_is_invalid()

    def test_upvote_reply(self):
        user = User.objects.get(pk=2)
        upvote_count_before = Reply.objects.get(pk=self.reply.id).upvotes.count()
        self.reply.upvote(user)
        upvote_count_after = Reply.objects.get(pk=self.reply.id).upvotes.count()
        self.assertEqual(upvote_count_before + 1, upvote_count_after)

    def test_upvote_reply_when_already_upvoted(self):
        upvote_count_before = Reply.objects.get(pk=self.reply.id).upvotes.count()
        self.reply.upvote(self.user)
        upvote_count_after = Reply.objects.get(pk=self.reply.id).upvotes.count()
        self.assertEqual(upvote_count_before - 1, upvote_count_after)

    def _assert_reply_is_valid(self):
        try:
            self.reply.full_clean()
        except (ValidationError):
            self.fail('Test comment should be valid')

    def _assert_reply_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.reply.full_clean()