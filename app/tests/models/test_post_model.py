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

    def test_post_title_cannot_be_blank(self):
        self.post.title = ''
        self._assert_post_is_invalid()

    def test_post_content_cannot_be_blank(self):
        self.post.content = ''
        self._assert_post_is_invalid()

    def test_title_can_be_100_characters_long(self):
        self.post.title = "x" * 100
        self._assert_post_is_valid()

    def test_title_cannot_be_over_100_characters_long(self):
        self.post.title = "x" * 101
        self._assert_post_is_invalid()

    def test_content_can_be_500_characters_long(self):
        self.post.content = "x" * 500
        self._assert_post_is_valid()

    def test_content_cannot_be_over_500_characters_long(self):
        self.post.content = "x" * 501
        self._assert_post_is_invalid()

    def test_post_author_cannot_be_none(self):
        self.post.author = None
        self._assert_post_is_invalid()

    def test_post_without_club_is_valid(self):
        self.post.club = None
        self._assert_post_is_valid()

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

    def test_modify_image_link(self):
        image_link = "abc"
        self.post.modify_image_link(image_link)
        self.assertEqual(self.post.image_link, image_link)

    def test_modify_book_link(self):
        book_link = "abc"
        self.post.modify_book_link(book_link)
        self.assertEqual(self.post.book_link, book_link)

    def test_modify_title(self):
        title = "abc"
        self.post.modify_title(title)
        self.assertEqual(self.post.title, title)

    def test_modify_content(self):
        content = "abc"
        self.post.modify_content(content)
        self.assertEqual(self.post.content, content)

    def _assert_post_is_valid(self):
        try:
            self.post.full_clean()
        except (ValidationError):
            self.fail('Test post should be valid')

    def _assert_post_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.post.full_clean()