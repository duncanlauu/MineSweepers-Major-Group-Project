"""Unit tests for the Post model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import Club, User, Book, Post, Comment


class PostModelTestCase(TestCase):
    """Unit tests for the Post model."""
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
    ]

    def setUp(self):
        self.user = User.objects.get(username='jakedoe')
        self.post = Post.objects.get(pk=1)

    def test_upvote_post(self):
        upvote_count_before = self.post.upvotes
        self.post.upvote_post()
        upvote_count_after = self.post.upvotes
        self.assertEqual(upvote_count_before + 1, upvote_count_after)

    def test_downvote_post(self):
        downvote_count_before = self.post.downvotes
        self.post.downvote_post()
        downvote_count_after = self.post.downvotes
        self.assertEqual(downvote_count_before + 1, downvote_count_after)

    def test_add_comment(self):
        comment = Comment.objects.get(pk=2)
        comment.post = self.post
        comment_count_before = self.post.comment_set.count()
        self.post.add_comment(comment)
        comment_count_after = self.post.comment_set.count()
        self.assertEqual(comment_count_before + 1, comment_count_after)

    def test_valid_post_without_club(self):
        pass

    def test_add_image_link(self):
        pass

    def test_add_book_link(self):
        pass
