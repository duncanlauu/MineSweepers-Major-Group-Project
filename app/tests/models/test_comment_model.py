"""Unit tests for the Comment model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import User, Comment, Reply


class CommentModelTestCase(TestCase):
    """Unit tests for the Comment model."""
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
        self.comment = Comment.objects.get(pk=1)

    def test_comment_content_cannot_be_blank(self):
        self.comment.content = ''
        self._assert_comment_is_invalid()

    def test_comment_content_can_be_500_characters_long(self):
        self.comment.content = "x" * 500
        self._assert_comment_is_valid()

    def test_comment_content_cannot_be_over_500_characters_long(self):
        self.comment.content = "x" * 501
        self._assert_comment_is_invalid()

    def test_comment_author_cannot_be_none(self):
        self.comment.author = None
        self._assert_comment_is_invalid()

    def test_comment_cannot_have_an_empty_post_fk(self):
        self.comment.post = None
        self._assert_comment_is_invalid()

    def test_upvote_comment(self):
        upvote_count_before = self.comment.upvotes
        self.comment.upvote_comment()
        upvote_count_after = self.comment.upvotes
        self.assertEqual(upvote_count_before + 1, upvote_count_after)

    def test_downvote_comment(self):
        downvote_count_before = self.comment.downvotes
        self.comment.downvote_comment()
        downvote_count_after = self.comment.downvotes
        self.assertEqual(downvote_count_before + 1, downvote_count_after)

    def test_add_reply(self):
        reply = Reply.objects.get(pk=3)
        reply_count_before = self.comment.reply_set.count()
        self.comment.add_reply(reply)
        reply_count_after = self.comment.reply_set.count()
        self.assertEqual(reply_count_before + 1, reply_count_after)

    def _assert_comment_is_valid(self):
        try:
            self.comment.full_clean()
        except (ValidationError):
            self.fail('Test comment should be valid')

    def _assert_comment_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.comment.full_clean()