from app.recommender_system.genre_algo import *
from django.test import TestCase


class GenreAlgoTest(TestCase):
    """Unit tests of genre related algorithms"""

    fixtures = [
        'app/tests/fixtures/default_book.json',
    ]

    def setUp(self):
        self.book = Book.objects.get(pk="0195153448")
        

    def test_get_google_api_genre(self):
        api_genre = get_google_api_genre(self.book.ISBN)
        self.assertEqual(api_genre, self.book.genre)

    def test_get_genre(self):
        genre = get_genre(self.book.ISBN)
        self.assertEqual(genre, self.book.genre)

    def test_get_books_from_iexact_genre(self):
        
