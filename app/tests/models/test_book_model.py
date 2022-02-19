"""Unit tests for the User model"""
import datetime
from django.core.exceptions import ValidationError
from django.test import TestCase
from app.models import User, Book


class BookModelTest(TestCase):
    """Test the Book model"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_books.json'
    ]

    def setUp(self):
        self.book = Book.objects.get(
            title="Harry Potter and the Sorcerer's Stone")

    def test_ISBN_primary_key(self):
        self.assertEqual(self.book.ISBN, self.book.pk)

    def test_title_cannot_be_blank(self):
        self.book.title = ''
        self._assert_book_is_invalid()

    def test_title_can_be_50_characters_long(self):
        self.book.title = 'x' * 50
        self._assert_book_is_valid()

    def test_title_cannot_be_over_50_characters_long(self):
        self.book.title = 'x' * 51
        self._assert_book_is_invalid()

    def test_author_cannot_be_blank(self):
        self.book.author = ''
        self._assert_book_is_invalid()

    def test_author_can_be_50_characters_long(self):
        self.book.author = 'x' * 50
        self._assert_book_is_valid()

    def test_author_cannot_be_over_50_characters_long(self):
        self.book.author = 'x' * 51
        self._assert_book_is_invalid()

    def test_publication_date_cannot_be_blank(self):
        self.book.publication_date = None
        self._assert_book_is_invalid()

    def test_publication_date_must_be_in_the_past(self):
        self.book.publication_date = datetime.date.today().year + 1
        self._assert_book_is_invalid()

    def test_publisher_can_be_50_characters_long(self):
        self.book.publisher = 'x' * 50
        self._assert_book_is_valid()

    def test_publisher_cannot_be_over_50_characters_long(self):
        self.book.publisher = 'x' * 51
        self._assert_book_is_invalid()

    def test_image_links_large_can_be_500_characters_long(self):
        self.book.image_links_large = 'x' * 500
        self._assert_book_is_valid()

    def test_image_links_large_cannot_be_over_500_characters_long(self):
        self.book.image_links_large = 'x' * 501
        self._assert_book_is_invalid()

    def test_image_links_medium_can_be_500_characters_long(self):
        self.book.image_links_medium = 'x' * 500
        self._assert_book_is_valid()

    def test_image_links_medium_cannot_be_over_500_characters_long(self):
        self.book.image_links_medium = 'x' * 501
        self._assert_book_is_invalid()

    def test_image_links_small_can_be_500_characters_long(self):
        self.book.image_links_small = 'x' * 500
        self._assert_book_is_valid()

    def test_image_links_small_cannot_be_over_500_characters_long(self):
        self.book.image_links_small = 'x' * 501
        self._assert_book_is_invalid()

    def test_genre_cannot_be_blank(self):
        self.book.genre = ''
        self._assert_book_is_invalid()

    def test_genre_can_be_50_characters_long(self):
        self.book.genre = 'x' * 50
        self._assert_book_is_valid()

    def test_genre_cannot_be_over_50_characters_long(self):
        self.book.genre = 'x' * 51
        self._assert_book_is_invalid()

    def _assert_book_is_valid(self):
        try:
            self.book.full_clean()
        except (ValidationError):
            self.fail('Test user should be valid')

    def _assert_book_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.book.full_clean()
