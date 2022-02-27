from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APITestCase

from app.management.commands.seed import seed_books
from app.models import Club, BookRecommendation, Book
from app.recommender_system.books_recommender import get_top_n
from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset, load_trained_model


class RecommenderAPITestCase(APITestCase):
    """Tests of the recommender API"""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/default_recommender_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_recommender_club.json']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.file_path = 'app/files/BX-Book-Ratings.csv'
        self.dataframe = get_combined_data(self.file_path)
        self.data = get_dataset_from_dataframe(self.dataframe)
        self.trainset = get_trainset_from_dataset(self.data)
        self.pred, self.algo = load_trained_model('app/files/dump_file')
        self.n = 10

    def setUp(self):
        seed_books()
        self.club = Club.objects.get(name="Joe's Club")
        self.uid = 1276726
        self.args = {'n': self.n}
        self.client = APIClient()

    def test_post_top_n(self):
        self.args['uid'] = self.uid
        self.args['action'] = 'top_n'
        url = reverse('recommender_top_n', kwargs=self.args)
        num_of_recommendations_before = BookRecommendation.objects.count()
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        top_n = get_top_n(self.uid, self.trainset, self.algo, self.n)
        self.assertEqual(response.data, top_n)
        num_of_recommendations_after = BookRecommendation.objects.count()
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    # def test_post_top_n_for_genre(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_for_genre'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_for_club(self):
    #     self.args['club'] = self.club.id
    #     self.args['action'] = 'top_n_for_club'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_for_club_for_genre(self):
    #     self.args['club'] = self.club.id
    #     self.args['action'] = 'top_n_for_club_for_genre'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_global(self):
    #     self.args['action'] = 'top_n_global'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_global_for_genre(self):
    #     self.args['action'] = 'top_n_global_for_genre'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_users_top_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_users_top_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_users_random_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_users_random_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_users_genre_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_users_genre_books'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_clubs_top_user_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_clubs_top_user_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_clubs_random_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_clubs_random_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_clubs_genre_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_clubs_genre_books'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_top_n_clubs_top_club_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_clubs_top_club_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_for_genre(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_for_genre'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_for_club(self):
    #     self.args['club'] = self.club.id
    #     self.args['action'] = 'top_n_for_club'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_for_club_for_genre(self):
    #     self.args['club'] = self.club.id
    #     self.args['action'] = 'top_n_for_club_for_genre'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_global(self):
    #     self.args['action'] = 'top_n_global'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_global_for_genre(self):
    #     self.args['action'] = 'top_n_global_for_genre'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_users_top_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_users_top_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_users_random_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_users_random_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_users_genre_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_users_genre_books'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_clubs_top_user_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_clubs_top_user_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_clubs_random_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_clubs_random_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_clubs_genre_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_clubs_genre_books'
    #     self.args['genre'] = 'fiction'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_top_n_clubs_top_club_books(self):
    #     self.args['uid'] = self.uid
    #     self.args['action'] = 'top_n_clubs_top_club_books'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_with_wrong_action(self):
    #     self.args['action'] = 'wrong_action'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_with_wrong_action(self):
    #     self.args['action'] = 'wrong_action'
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_get_with_no_action(self):
    #     url = reverse('recommender', kwargs=self.args)
    #
    # def test_post_with_no_action(self):
    #     url = reverse('recommender', kwargs=self.args)

