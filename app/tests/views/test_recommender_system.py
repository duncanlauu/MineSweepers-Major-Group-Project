import logging

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APITestCase
from surprise import SVD

from app.management.commands.seed import seed_books, seed_users, seed_clubs, seed_ratings
from app.models import Club, BookRecommendation, BookRecommendationForClub, GlobalBookRecommendation, \
    UserRecommendation, User, ClubRecommendation
from app.recommender_system.books_recommender import get_top_n, get_top_n_for_genre, get_top_n_for_club, \
    get_top_n_for_club_for_genre, get_global_top_n, get_global_top_n_for_genre
from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset, generate_pred_set, train_model, test_model, dump_trained_model, load_trained_model
from app.recommender_system.people_recommender import get_top_n_users_by_favourite_books, get_top_n_users_double_random, \
    get_top_n_users_for_a_genre, get_top_n_clubs_using_top_items_for_a_user, get_top_n_clubs_using_random_items, \
    get_top_n_clubs_for_a_genre, get_top_n_clubs_using_clubs_books


class RecommenderAPITestCase(APITestCase):
    """Tests of the recommender API"""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_recommender_club.json']

    def setUp(self):
        seed_books()
        seed_users()
        seed_ratings()
        seed_clubs()
        self.csv_file_path = 'app/files/BX-Book-Ratings.csv'
        self.dump_file_path = 'app/files/dump_file'
        self.dataframe = get_combined_data(self.csv_file_path)
        self.data = get_dataset_from_dataframe(self.dataframe)
        self.trainset = get_trainset_from_dataset(self.data)
        self.algo = SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)
        train_model(self.algo, self.trainset)
        self.pred = test_model(self.algo, self.trainset)
        dump_trained_model(self.dump_file_path, self.algo, self.pred)
        # self.pred, self.algo = load_trained_model(self.dump_file_path)
        self.n = 10
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
        self.client = APIClient()
        self.genre = 'fiction'

    # Unfortunately, the seeding takes about 2-3 minutes each time and I want to test the recommender
    # system thoroughly so I'll need to run non-atomic tests. I will create one test which runs
    # all the tests so that the seeding is done only once. Right now I have 26 tests which require seeding
    # and I don't want to wait an hour to run the tests every time.
    def test_everything(self):
        self._post_top_n_test()
        self._post_top_n_for_genre_test()
        self._post_top_n_for_club_test()
        self._post_top_n_for_club_for_genre_test()
        self._post_top_n_global_test()
        self._post_top_n_global_for_genre_test()
        self._post_top_n_users_top_books_test()
        self._post_top_n_users_random_books_test()
        self._post_top_n_users_genre_books_test()
        self._post_top_n_clubs_top_user_books_test()
        self._post_top_n_clubs_random_books_test()
        self._post_top_n_clubs_genre_books_test()
        self._post_top_n_clubs_top_club_books_test()
        self._post_with_no_action_test()
        self._post_retrain_test()
        self._post_with_wrong_action_test()
        self._get_top_n_test()
        self._get_top_n_for_genre_test()
        self._get_top_n_for_club_test()
        self._get_top_n_for_club_for_genre_test()
        self._get_top_n_global_test()
        self._get_top_n_global_for_genre_test()
        self._get_top_n_users_top_books_test()
        self._get_top_n_users_random_books_test()
        self._get_top_n_users_genre_books_test()
        self._get_top_n_clubs_top_user_books_test()
        self._get_top_n_clubs_random_books_test()
        self._get_top_n_clubs_genre_books_test()
        self._get_top_n_clubs_top_club_books_test()
        self._get_with_no_action_test()
        self._get_with_wrong_action_test()

    def _post_top_n_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = BookRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n(self.uid, self.trainset, self.algo, self.n)
        num_of_recommendations_after = BookRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_for_genre_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_for_genre', 'genre': self.genre}
        url = reverse('recommender_top_n_for_genre', kwargs=args)
        num_of_recommendations_before = BookRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_for_genre(self.uid, self.trainset, self.algo, self.genre, self.n)
        num_of_recommendations_after = BookRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_for_club_test(self):
        args = {'n': self.n, 'id': self.club.id, 'action': 'top_n_for_club'}
        pred_lookup = generate_pred_set(self.pred)
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = BookRecommendationForClub.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_for_club(self.club.id, self.trainset, self.algo, pred_lookup, self.n)
        num_of_recommendations_after = BookRecommendationForClub.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_for_club_for_genre_test(self):
        args = {'n': self.n, 'id': self.club.id, 'action': 'top_n_for_club_for_genre', 'genre': self.genre}
        pred_lookup = generate_pred_set(self.pred)
        url = reverse('recommender_top_n_for_genre', kwargs=args)
        num_of_recommendations_before = BookRecommendationForClub.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_for_club_for_genre(self.club.id, self.trainset, self.algo, pred_lookup, self.genre, self.n)
        num_of_recommendations_after = BookRecommendationForClub.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_global_test(self):
        args = {'n': self.n, 'action': 'top_n_global'}
        url = reverse('recommender_top_n_global', kwargs=args)
        num_of_recommendations_before = GlobalBookRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_global_top_n(self.dataframe, self.trainset.global_mean, self.n)
        num_of_recommendations_after = GlobalBookRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_global_for_genre_test(self):
        args = {'n': self.n, 'action': 'top_n_global_for_genre', 'genre': self.genre}
        url = reverse('recommender_top_n_global_for_genre', kwargs=args)
        num_of_recommendations_before = GlobalBookRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_global_top_n_for_genre(self.dataframe, self.trainset.global_mean, self.genre, self.n)
        num_of_recommendations_after = GlobalBookRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_users_top_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_users_top_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = UserRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_users_by_favourite_books(self.uid, self.trainset, self.algo, self.n)
        num_of_recommendations_after = UserRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_users_random_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_users_random_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = UserRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_users_double_random(self.uid, self.trainset, self.algo, self.n)
        num_of_recommendations_after = UserRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_users_genre_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_users_genre_books', 'genre': self.genre}
        url = reverse('recommender_top_n_for_genre', kwargs=args)
        num_of_recommendations_before = UserRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_users_for_a_genre(self.uid, self.trainset, self.algo, self.genre, self.n)
        num_of_recommendations_after = UserRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_clubs_top_user_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_clubs_top_user_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = ClubRecommendation.objects.count()
        response = self.client.post(url)
        clubs = list(Club.objects.all())
        top_n = get_top_n_clubs_using_top_items_for_a_user(self.uid, self.algo, self.trainset, clubs, self.n)
        num_of_recommendations_after = ClubRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_clubs_random_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_clubs_random_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = ClubRecommendation.objects.count()
        response = self.client.post(url)
        clubs = list(Club.objects.all())
        top_n = get_top_n_clubs_using_random_items(self.uid, self.algo, self.trainset, clubs, self.n)
        num_of_recommendations_after = ClubRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_clubs_genre_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_clubs_genre_books', 'genre': self.genre}
        url = reverse('recommender_top_n_for_genre', kwargs=args)
        num_of_recommendations_before = ClubRecommendation.objects.count()
        response = self.client.post(url)
        clubs = list(Club.objects.all())
        top_n = get_top_n_clubs_for_a_genre(self.uid, self.algo, self.trainset, clubs, self.genre, self.n)
        num_of_recommendations_after = ClubRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_top_n_clubs_top_club_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_clubs_top_club_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = ClubRecommendation.objects.count()
        response = self.client.post(url)
        clubs = list(Club.objects.all())
        top_n = get_top_n_clubs_using_clubs_books(self.uid, self.algo, clubs, self.n)
        num_of_recommendations_after = ClubRecommendation.objects.count()
        self._assert_correct(response, top_n)
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, self.n)

    def _post_with_no_action_test(self):
        url = reverse('recommender', kwargs={})
        response = self.client.post(url)
        self.assertEqual(response.data, 'You need to provide an action')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def _post_retrain_test(self):
        url = reverse('recommender_action', kwargs={'action': 'retrain'})
        response = self.client.post(url)
        self.assertEqual(response.data, 'Model has been trained')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pred, self.algo = load_trained_model(self.dump_file_path)

    def _post_with_wrong_action_test(self):
        args = {'action': 'wrong_action'}
        url = reverse('recommender_action', kwargs=args)
        response = self.client.post(url)
        self.assertEqual(response.data, 'You need to provide a correct action')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def _post_with_wrong_parameters_test(self):
        args = {'action': 'top_n_users_top_books'}
        url = reverse('recommender_action', kwargs=args)
        response = self.client.post(url)
        self.assertEqual(response.data, 'You need to provide correct parameters')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def _get_top_n_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = BookRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n(self.uid, self.trainset, self.algo, self.n)
        num_of_recommendations_after = BookRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['book'], top_n[i][0])
            self.assertEqual(recommendations[i]['rating'], top_n[i][1])

    def _get_top_n_for_genre_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_for_genre', 'genre': 'fiction'}
        url = reverse('recommender_top_n_for_genre', kwargs=args)
        num_of_recommendations_before = BookRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_for_genre(self.uid, self.trainset, self.algo, self.genre, self.n)
        num_of_recommendations_after = BookRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['book'], top_n[i][0])
            self.assertEqual(recommendations[i]['rating'], top_n[i][1])

    def _get_top_n_for_club_test(self):
        args = {'n': self.n, 'id': self.club.id, 'action': 'top_n_for_club'}
        pred_lookup = generate_pred_set(self.pred)
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = BookRecommendationForClub.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_for_club(self.club.id, self.trainset, self.algo, pred_lookup, self.n)
        num_of_recommendations_after = BookRecommendationForClub.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        recommendations = list(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['club'], self.club.id)
            self.assertEqual(recommendations[i]['book'], top_n[i][0])
            self.assertEqual(recommendations[i]['rating'], top_n[i][1])

    def _get_top_n_for_club_for_genre_test(self):
        args = {'n': self.n, 'id': self.club.id, 'action': 'top_n_for_club_for_genre', 'genre': self.genre}
        pred_lookup = generate_pred_set(self.pred)
        url = reverse('recommender_top_n_for_genre', kwargs=args)
        num_of_recommendations_before = BookRecommendationForClub.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_for_club_for_genre(self.club.id, self.trainset, self.algo, pred_lookup, self.genre, self.n)
        num_of_recommendations_after = BookRecommendationForClub.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['club'], self.club.id)
            self.assertEqual(recommendations[i]['book'], top_n[i][0])
            self.assertEqual(recommendations[i]['rating'], top_n[i][1])

    def _get_top_n_global_test(self):
        args = {'n': self.n, 'action': 'top_n_global'}
        url = reverse('recommender_top_n_global', kwargs=args)
        num_of_recommendations_before = GlobalBookRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_global_top_n(self.dataframe, self.trainset.global_mean, self.n)
        num_of_recommendations_after = GlobalBookRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['book'], top_n[i][0])
            self.assertEqual(recommendations[i]['flat_rating'], top_n[i][1])
            self.assertEqual(recommendations[i]['number_of_ratings'], top_n[i][2])
            self.assertEqual(recommendations[i]['weighted_rating'], top_n[i][3])

    def _get_top_n_global_for_genre_test(self):
        args = {'n': self.n, 'action': 'top_n_global_for_genre', 'genre': self.genre}
        url = reverse('recommender_top_n_global_for_genre', kwargs=args)
        num_of_recommendations_before = GlobalBookRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_global_top_n_for_genre(self.dataframe, self.trainset.global_mean, self.genre, self.n)
        num_of_recommendations_after = GlobalBookRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['book'], top_n[i][0])
            self.assertEqual(recommendations[i]['flat_rating'], top_n[i][1])
            self.assertEqual(recommendations[i]['number_of_ratings'], top_n[i][2])
            self.assertEqual(recommendations[i]['weighted_rating'], top_n[i][3])

    def _get_top_n_users_top_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_users_top_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = UserRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_users_by_favourite_books(self.uid, self.trainset, self.algo, self.n)
        num_of_recommendations_after = UserRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['recommended_user'], top_n[i][0])
            self.assertEqual(recommendations[i]['diff'], top_n[i][1])

    def _get_top_n_users_random_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_users_random_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = UserRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_users_double_random(self.uid, self.trainset, self.algo, self.n)
        num_of_recommendations_after = UserRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['recommended_user'], top_n[i][0])
            self.assertEqual(recommendations[i]['diff'], top_n[i][1])

    def _get_top_n_users_genre_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_users_genre_books', 'genre': self.genre}
        url = reverse('recommender_top_n_for_genre', kwargs=args)
        num_of_recommendations_before = UserRecommendation.objects.count()
        response = self.client.post(url)
        top_n = get_top_n_users_for_a_genre(self.uid, self.trainset, self.algo, self.genre, self.n)
        num_of_recommendations_after = UserRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['recommended_user'], top_n[i][0])
            self.assertEqual(recommendations[i]['diff'], top_n[i][1])

    def _get_top_n_clubs_top_user_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_clubs_top_user_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = ClubRecommendation.objects.count()
        response = self.client.post(url)
        clubs = list(Club.objects.all())
        top_n = get_top_n_clubs_using_top_items_for_a_user(self.uid, self.algo, self.trainset, clubs, self.n)
        num_of_recommendations_after = ClubRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['club'], top_n[i][0])
            self.assertEqual(recommendations[i]['diff'], top_n[i][1])

    def _get_top_n_clubs_random_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_clubs_random_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = ClubRecommendation.objects.count()
        response = self.client.post(url)
        clubs = list(Club.objects.all())
        top_n = get_top_n_clubs_using_random_items(self.uid, self.algo, self.trainset, clubs, self.n)
        num_of_recommendations_after = ClubRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['club'], top_n[i][0])
            self.assertEqual(recommendations[i]['diff'], top_n[i][1])

    def _get_top_n_clubs_genre_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_clubs_genre_books', 'genre': self.genre}
        url = reverse('recommender_top_n_for_genre', kwargs=args)
        num_of_recommendations_before = ClubRecommendation.objects.count()
        response = self.client.post(url)
        clubs = list(Club.objects.all())
        top_n = get_top_n_clubs_for_a_genre(self.uid, self.algo, self.trainset, clubs, self.genre, self.n)
        num_of_recommendations_after = ClubRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['club'], top_n[i][0])
            self.assertEqual(recommendations[i]['diff'], top_n[i][1])

    def _get_top_n_clubs_top_club_books_test(self):
        args = {'n': self.n, 'id': self.uid, 'action': 'top_n_clubs_top_club_books'}
        url = reverse('recommender_top_n', kwargs=args)
        num_of_recommendations_before = ClubRecommendation.objects.count()
        response = self.client.post(url)
        clubs = list(Club.objects.all())
        top_n = get_top_n_clubs_using_clubs_books(self.uid, self.algo, clubs, self.n)
        num_of_recommendations_after = ClubRecommendation.objects.count()
        self._assert_correct(response, top_n)
        # After the previous post clear n items and insert new n items so the number of elements doesn't change
        self.assertEqual(num_of_recommendations_after - num_of_recommendations_before, 0)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        recommendations = list(response.data)
        self.assertEqual(len(top_n), len(recommendations))
        for i in range(0, self.n):
            self.assertEqual(recommendations[i]['user'], self.uid)
            self.assertEqual(recommendations[i]['club'], top_n[i][0])
            self.assertEqual(recommendations[i]['diff'], top_n[i][1])

    def _get_with_wrong_action_test(self):
        args = {'action': 'wrong_action'}
        url = reverse('recommender_action', kwargs=args)
        response = self.client.get(url)
        self.assertEqual(response.data, 'You need to provide a correct action')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def _get_with_no_action_test(self):
        url = reverse('recommender', kwargs={})
        response = self.client.get(url)
        self.assertEqual(response.data, 'You need to provide an action')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def _get_with_wrong_parameters_test(self):
        args = {'action': 'top_n_users_top_books'}
        url = reverse('recommender_action', kwargs=args)
        response = self.client.get(url)
        self.assertEqual(response.data, 'You need to provide correct parameters')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def _assert_correct(self, response, top_n):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, top_n)
