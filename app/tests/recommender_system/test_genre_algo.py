from app.recommender_system.file_management import get_trainset_from_dataset, get_dataset_from_dataframe, \
    get_combined_data
from app.recommender_system.genre_algo import *
from app.management.commands.seed import *
from django.test import TestCase


class GenreAlgoTest(TestCase):
    """Unit tests of genre related algorithms"""

    def setUp(self):
        seed_books()
        self.book = Book.objects.get(pk="0195153448")
        self.csv_file_path = 'app/files/BX-Book-Ratings.csv'
        self.dump_file_path = 'app/files/dump_file'
        self.dataframe = get_combined_data(self.csv_file_path)
        self.data = get_dataset_from_dataframe(self.dataframe)
        self.trainset = get_trainset_from_dataset(self.data)

    def test_main(self):
        """
        Main test function
        All the unit tests are grouped into one test as the seeding time is substantial
        """
        self._test_get_google_api_genre()
        self._test_get_google_api_genre_with_invalid_isbn()
        self._test_get_genre()
        self._test_get_genre_with_invalid_isbn()
        self._test_get_books_from_iexact_genre()
        self._test_get_books_from_iexact_invalid_genre()
        self._test_get_books_from_similar_genre()
        self._test_get_books_from_similar_invalid_genre()
        self._test_get_top_n_merged_genres()
        self._test_get_top_n_merged_genres_with_books()
        self._test_get_isbns_for_a_genre()

    def _test_get_google_api_genre(self):
        api_genre = get_google_api_genre(self.book.ISBN)
        self.assertEqual(api_genre, self.book.genre)

    def _test_get_google_api_genre_with_invalid_isbn(self):
        api_genre = get_google_api_genre('invalid_isbn')
        self.assertEqual(api_genre, 'N/A')

    def _test_get_genre(self):
        genre = get_genre(self.book.ISBN)
        self.assertEqual(genre, self.book.genre)

    def _test_get_genre_with_invalid_isbn(self):
        genre = get_genre('invalid isbn')
        self.assertEqual(genre, None)

    def _test_get_books_from_iexact_genre(self):
        books_list = get_books_from_iexact_genre('fiction')
        self.assertEqual(len(books_list), 87166)

    def _test_get_books_from_iexact_invalid_genre(self):
        books_list = get_books_from_iexact_genre('invalid_genre')
        self.assertEqual(len(books_list), 0)

    def _test_get_books_from_similar_genre(self):
        books_list = get_books_from_similar_genre('fiction')
        self.assertEqual(len(books_list), 107338)

    def _test_get_books_from_similar_invalid_genre(self):
        books_list = get_books_from_similar_genre('invalid_genre')
        self.assertEqual(len(books_list), 0)

    def _test_get_top_n_merged_genres(self):
        top_n_genres = get_top_n_merged_genres()
        self.assertEqual(len(top_n_genres), 25)
        # test if all merged genres are unique
        self.assertEqual(len(set(top_n_genres)), 25)
        # test if there are no similar genres and the subgenres are the ones removed
        self.assertTrue('fiction' in top_n_genres)
        # 2nd top raw (unmerged) genre
        self.assertTrue('juvenile fiction' not in top_n_genres)
        self.assertTrue('science' in top_n_genres)
        # 25th top raw (unmerged) genre
        self.assertTrue('political science' not in top_n_genres)
        # test that similarity does take into account negating 'non' keywords
        # 'fiction' is not similar to 'juvenile nonfiction' hence not removed
        self.assertTrue('juvenile nonfiction' in top_n_genres)
        # check top 10 is correct
        correct_result = [
            'fiction',
            'biography & autobiography',
            'religion',
            'history',
            'juvenile nonfiction',
            'business & economics',
            'cooking',
            'humor',
            'body, mind & spirit',
            'health & fitness'
        ]
        self.assertListEqual(top_n_genres[:10], correct_result)

    def _test_get_top_n_merged_genres_with_books(self):
        top_genres_with_books = get_top_n_merged_genres_with_books()
        # check top 5 books of each of the top 5 genres that all books have the 
        # same genre or a subgenre as the corresponding genre in the tuple
        for genre, books_list in top_genres_with_books[:5]:
            for book in books_list[:5]:
                self.assertTrue(book.genre.lower() ==
                                genre or genre in book.genre.lower())

    def _test_get_isbns_for_a_genre(self):
        genre = 'fiction'
        # This needs to be sorted to compare the results because internally it's a set which is unsorted
        isbns = sorted(get_isbns_for_a_genre(genre, self.trainset))[:15]
        correct_first_15_isbns_for_fiction = ['0002005395', '0002219980', '000222674X', '0002245663', '0002251760',
                                              '0002253178', '0002254123', '0002254131', '000225929X', '0002259478',
                                              '0002261022', '0002325780', '0006163041', '0006176909', '0006471641']
        self.assertEqual(isbns, correct_first_15_isbns_for_fiction)
