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
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/default_post.json',
        'app/tests/fixtures/other_posts.json',
        'app/tests/fixtures/default_comment.json',
        'app/tests/fixtures/other_comments.json',
        'app/tests/fixtures/default_reply.json',
        'app/tests/fixtures/other_replies.json',
    ]

    def setUp(self):
        self.user = User.objects.get(username='jakedoe')
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
        upvote_count_before = self.reply.upvotes
        self.reply.upvote()
        upvote_count_after = self.reply.upvotes
        self.assertEqual(upvote_count_before + 1, upvote_count_after)

    def test_downvote_reply(self):
        downvote_count_before = self.reply.downvotes
        self.reply.downvote()
        downvote_count_after = self.reply.downvotes
        self.assertEqual(downvote_count_before + 1, downvote_count_after)

    def _assert_reply_is_valid(self):
        try:
            self.reply.full_clean()
        except (ValidationError):
            self.fail('Test comment should be valid')

    def _assert_reply_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.reply.full_clean()