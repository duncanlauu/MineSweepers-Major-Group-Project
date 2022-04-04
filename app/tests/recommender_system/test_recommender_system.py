from operator import itemgetter

from surprise import SVD

from app.management.commands.seed import seed_books, seed_clubs, seed_ratings, seed_users
from app.models import User
from app.recommender_system.books_recommender import get_top_n, get_top_n_for_k, get_global_top_n, \
    get_top_n_for_genre, get_top_n_for_k_for_genre, get_global_top_n_for_genre, get_top_n_for_club, \
    get_top_n_for_club_for_genre
from app.recommender_system.file_management import *
from django.test import TestCase

from app.recommender_system.people_recommender import get_top_n_users_by_favourite_books, \
    get_top_n_users_random, get_top_n_users_for_a_genre, get_top_n_clubs_using_random_items, \
    get_top_n_clubs_using_top_items_for_a_user, get_top_n_clubs_for_a_genre, get_top_n_clubs_using_clubs_books


class RecommenderSystemTestCase(TestCase):
    """
    Tests for the recommender system functionality

    Since the algorithm training is randomised, I cannot provide complete tests for the functionality.
    I test for the size of the results and that they are indeed ordered by the correct metric.
    I also test the file management side of things, which can be tested more thoroughly.
    """

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_recommender_club.json']

    def setUp(self):
        seed_books()
        seed_users()
        seed_ratings()
        seed_clubs()
        self.file_path = 'app/files/BX-Book-Ratings-filtered.csv'
        self.dataframe = get_combined_data(self.file_path)
        self.data = get_dataset_from_dataframe(self.dataframe)
        self.trainset = get_trainset_from_dataset(self.data)
        self.algo = SVD()
        train_model(self.algo, self.trainset)
        self.predictions = test_model(self.algo, self.trainset)
        self.predictions_uid_and_iid_lookup = generate_pred_set(self.predictions)
        self.club = Club.objects.get(name="Joe's Club")
        # Loading the user with pk 1276726 through a fixture made all the seeder users start from 1276726 as well which
        # somehow broke everything?
        self.user = User.objects.create(
            pk=1276726,
            username='KevinBoy',
            email='kevindoe@example.com',
            first_name='Kevin',
            last_name='Doe',
            bio='this is my bio',
            location='London',
            birthday="1980-01-01",
            password="pbkdf2_sha256$260000$VEDi9wsMYG6eNVeL8WSPqj$LHEiR2iUkusHCIeiQdWS+xQGC9/CjhhrjEOESMMp+c0="
        )
        self.uid = 1276726
        self.iid = '0155061224'
        self.genre = 'fiction'
        self.n = 10
        self.clubs = list(Club.objects.all())
        self.user_list = [1276726, 1276736, 1276729, 1276704, 1276709, 1276721, 1276723]

    def test_everything(self):
        self._test_filtering_dataset()
        self._test_saving_and_loading_algo()
        self._test_get_top_n()
        self._test_get_top_n_for_genre()
        self._test_get_top_n_for_k()
        self._test_get_top_n_for_k_for_genre()
        self._test_get_top_n_global()
        self._test_get_top_n_global_for_genre()
        self._test_get_top_n_for_club()
        self._test_get_top_n_for_club_for_genre()
        self._test_get_top_n_users_by_favourite_books()
        self._test_get_top_n_users_by_random_books()
        self._test_get_top_n_users_for_genre()
        self._test_get_top_n_clubs_random_books()
        self._test_get_top_n_clubs_user_books()
        self._test_get_top_n_clubs_for_genre()
        self._test_get_top_n_clubs_for_club_books()

    def _test_filtering_dataset(self):
        file_path = 'app/files/BX-Book-Ratings.csv'
        dataframe = get_combined_data(file_path, False)
        dataframe = dataframe.sort_values('User-ID')
        dataframe = dataframe.reset_index(drop=True)

        self.dataframe = self.dataframe.sort_values('User-ID')
        self.dataframe = self.dataframe.reset_index(drop=True)
        self.assertTrue(self.dataframe.equals(dataframe))

    def _test_saving_and_loading_algo(self):
        # Dump algorithm and reload it.
        file_name = 'app/files/dump_file'
        dump_trained_model(file_name, self.algo, self.predictions)
        loaded_predictions, loaded_algo = load_trained_model(file_name)

        prediction = self.algo.predict(uid=self.uid, iid=self.iid, r_ui=5)
        loaded_prediction = loaded_algo.predict(uid=self.uid, iid=self.iid, r_ui=5)
        self.assertEqual(prediction, loaded_prediction)
        self.assertEqual(self.predictions, loaded_predictions)

    def _test_get_top_n(self):
        top_n = get_top_n(self.uid, self.trainset, self.algo, self.n)
        self._assert_correct(top_n)

    def _test_get_top_n_for_genre(self):
        top_n = get_top_n_for_genre(self.uid, self.trainset, self.algo, self.genre, self.n)
        self._assert_correct(top_n)
        self._assert_correct_genre(top_n)

    def _test_get_top_n_for_k(self):
        top_n = get_top_n_for_k(self.user_list, self.trainset, self.algo, self.predictions_uid_and_iid_lookup, self.n)
        self._assert_correct(top_n)

    def _test_get_top_n_for_k_for_genre(self):
        top_n = get_top_n_for_k_for_genre(self.user_list, self.trainset, self.algo, self.predictions_uid_and_iid_lookup,
                                          self.genre, self.n)
        self._assert_correct(top_n)
        self._assert_correct_genre(top_n)

    def _test_get_top_n_global(self):
        top_n_global = get_global_top_n(self.dataframe, self.trainset.global_mean, self.n)
        self._assert_correct_global_top(top_n_global)

    def _test_get_top_n_global_for_genre(self):
        top_n_global = get_global_top_n_for_genre(self.dataframe, self.trainset.global_mean, self.genre, self.n)
        self._assert_correct_global_top(top_n_global)
        self._assert_correct_genre_global(top_n_global)

    def _test_get_top_n_for_club(self):
        top_n = get_top_n_for_club(self.club, self.trainset, self.algo, self.predictions_uid_and_iid_lookup, self.n)
        self._assert_correct(top_n)

    def _test_get_top_n_for_club_for_genre(self):
        top_n = get_top_n_for_club_for_genre(self.club, self.trainset, self.algo, self.predictions_uid_and_iid_lookup,
                                             self.genre, self.n)
        self._assert_correct(top_n)
        self._assert_correct_genre(top_n)

    def _test_get_top_n_users_by_favourite_books(self):
        top_n = get_top_n_users_by_favourite_books(self.uid, self.trainset, self.algo, self.n)
        self._assert_correct_people(top_n)

    def _test_get_top_n_users_by_random_books(self):
        top_n = get_top_n_users_random(self.uid, self.trainset, self.algo, self.n)
        self._assert_correct_people(top_n)

    def _test_get_top_n_users_for_genre(self):
        top_n = get_top_n_users_for_a_genre(self.uid, self.trainset, self.algo, self.genre, self.n)
        self._assert_correct_people(top_n)

    def _test_get_top_n_clubs_random_books(self):
        top_n = get_top_n_clubs_using_random_items(self.uid, self.algo, self.trainset, self.clubs, self.n)
        self._assert_correct_people(top_n)

    def _test_get_top_n_clubs_user_books(self):
        top_n = get_top_n_clubs_using_top_items_for_a_user(self.uid, self.algo, self.trainset, self.clubs, self.n)
        self._assert_correct_people(top_n)

    def _test_get_top_n_clubs_for_genre(self):
        top_n = get_top_n_clubs_for_a_genre(self.uid, self.algo, self.trainset, self.clubs, self.genre, self.n)
        self._assert_correct_people(top_n)

    def _test_get_top_n_clubs_for_club_books(self):
        top_n = get_top_n_clubs_using_clubs_books(self.uid, self.algo, self.clubs, self.n)
        self._assert_correct_people(top_n)

    def _assert_correct(self, top_n):
        self.assertEqual(len(top_n), self.n)
        sorted_copy = top_n
        sorted_copy.sort(key=itemgetter(1))
        self.assertEqual(top_n, sorted_copy)

    def _assert_correct_genre(self, top_n):
        for book, rating in top_n:
            self.assertTrue(self.genre.casefold() in Book.objects.get(ISBN=book).genre.casefold())

    def _assert_correct_global_top(self, top_n_global):
        self.assertEqual(len(top_n_global), self.n)
        sorted_copy = top_n_global
        sorted_copy.sort(key=itemgetter(3))
        self.assertEqual(top_n_global, sorted_copy)

    def _assert_correct_genre_global(self, top_n):
        for book, r, n, wr in top_n:
            self.assertTrue(self.genre.casefold() in Book.objects.get(ISBN=book).genre.casefold())

    def _assert_correct_people(self, top_n):
        self.assertEqual(len(top_n), self.n)
        sorted_copy = top_n
        sorted_copy.sort(key=itemgetter(1), reverse=True)
        self.assertEqual(top_n, sorted_copy)
