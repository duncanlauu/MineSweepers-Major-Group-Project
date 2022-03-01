from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from surprise import SVD

from app.models import BookRecommendation, BookRecommendationForClub, GlobalBookRecommendation, UserRecommendation, \
    Club, ClubRecommendation, User, Book
from app.recommender_system.books_recommender import get_top_n, get_top_n_for_club, get_global_top_n, \
    get_top_n_for_genre, get_top_n_for_club_for_genre, get_global_top_n_for_genre
from app.recommender_system.file_management import load_trained_model, get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset, generate_pred_set, train_model, dump_trained_model, test_model
from app.recommender_system.people_recommender import get_top_n_users_by_favourite_books, get_top_n_users_double_random, \
    get_top_n_users_for_a_genre, get_top_n_clubs_using_random_items, get_top_n_clubs_using_top_items_for_a_user, \
    get_top_n_clubs_for_a_genre, get_top_n_clubs_using_clubs_books
from app.serializers import BookRecommendationSerializer, ClubRecommendationSerializer, \
    GlobalBookRecommendationSerializer, UserRecommendationSerializer, BookRecommendationForClubSerializer


class RecommenderAPI(APIView):
    """This class is responsible for handling all requests to the recommender system

    The basic idea is that a post request calls the recommender system to calculate the recommended items and
    save the recommendations to the database, whereas the get requests retrieve the recommendations from the database.
    """
    # Not sure about this
    # permission_classes = [permissions.IsAuthenticated]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.csv_file_path = 'app/files/BX-Book-Ratings.csv'
        self.dump_file_name = 'app/files/dump_file'
        self.dataframe = None
        self.data = None
        self.trainset = None
        self.pred = None
        self.algo = None

    def get(self, request, *args, **kwargs):
        if 'action' not in kwargs:
            return Response(data='You need to provide an action', status=status.HTTP_404_NOT_FOUND)
        action = kwargs['action']
        try:
            if action == 'top_n':
                n = kwargs['n']
                uid = kwargs['id']
                ratings = list(BookRecommendation.objects.filter(user=uid, genre='Unspecified').order_by('-rating'))[:n]
                serializer = BookRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_for_genre':
                n = kwargs['n']
                uid = kwargs['id']
                genre = kwargs['genre']
                ratings = list(BookRecommendation.objects.filter(user=uid, genre=genre).order_by('-rating'))[:n]
                serializer = BookRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_for_club':
                n = kwargs['n']
                club = kwargs['id']
                ratings = list(BookRecommendationForClub.objects.filter(club=club, genre='Unspecified').order_by('-rating'))[:n]
                serializer = BookRecommendationForClubSerializer(ratings, many=True)
            elif action == 'top_n_for_club_for_genre':
                n = kwargs['n']
                club = kwargs['id']
                genre = kwargs['genre']
                ratings = list(BookRecommendationForClub.objects.filter(club=club, genre=genre).order_by('-rating'))[:n]
                serializer = BookRecommendationForClubSerializer(ratings, many=True)
            elif action == 'top_n_global':
                n = kwargs['n']
                ratings = list(GlobalBookRecommendation.objects.filter(genre='Unspecified').order_by('-weighted_rating'))[:n]
                serializer = GlobalBookRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_global_for_genre':
                n = kwargs['n']
                genre = kwargs['genre']
                ratings = list(GlobalBookRecommendation.objects.filter(genre=genre).order_by('-weighted_rating'))[:n]
                serializer = GlobalBookRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_users_top_books':
                n = kwargs['n']
                uid = kwargs['id']
                ratings = list(UserRecommendation.objects.filter(user=uid, method='top_books').order_by('diff'))[:n]
                serializer = UserRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_users_random_books':
                n = kwargs['n']
                uid = kwargs['id']
                ratings = list(UserRecommendation.objects.filter(user=uid, method='random_books').order_by('diff'))[:n]
                serializer = UserRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_users_genre_books':
                n = kwargs['n']
                uid = kwargs['id']
                genre = kwargs['genre']
                ratings = list(UserRecommendation.objects.filter(user=uid, method='genre_books ' + genre).order_by('diff'))[:n]
                serializer = UserRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_clubs_top_user_books':
                n = kwargs['n']
                uid = kwargs['id']
                ratings = list(ClubRecommendation.objects.filter(user=uid, method='top_user_books').order_by('diff'))[:n]
                serializer = ClubRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_clubs_random_books':
                n = kwargs['n']
                uid = kwargs['id']
                ratings = list(ClubRecommendation.objects.filter(user=uid, method='random_books').order_by('diff'))[:n]
                serializer = ClubRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_clubs_genre_books':
                n = kwargs['n']
                uid = kwargs['id']
                genre = kwargs['genre']
                ratings = list(ClubRecommendation.objects.filter(user=uid, method='genre_books ' + genre).order_by('diff'))[:n]
                serializer = ClubRecommendationSerializer(ratings, many=True)
            elif action == 'top_n_clubs_top_club_books':
                n = kwargs['n']
                uid = kwargs['id']
                ratings = list(ClubRecommendation.objects.filter(user=uid, method='top_club_books').order_by('diff'))[:n]
                serializer = ClubRecommendationSerializer(ratings, many=True)
            else:
                return Response(data='You need to provide a correct action', status=status.HTTP_404_NOT_FOUND)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except KeyError:
            return Response(data='You need to provide correct parameters', status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        if 'action' not in kwargs:
            return Response(data='You need to provide an action', status=status.HTTP_404_NOT_FOUND)
        action = kwargs['action']

        try:
            self.dataframe = get_combined_data(self.csv_file_path)
            self.data = get_dataset_from_dataframe(self.dataframe)
            self.trainset = get_trainset_from_dataset(self.data)

            if action == 'retrain':
                self.algo = SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)
                train_model(self.algo, self.trainset)
                self.pred = test_model(self.algo, self.trainset)
                dump_trained_model(self.dump_file_name, self.algo, self.pred)
                return Response(data='Model has been trained', status=status.HTTP_200_OK)

            # For loading the model, the filename is 'app/files/dump_file'
            self.pred, self.algo = load_trained_model(self.dump_file_name)

            if action == 'top_n':
                uid = kwargs['id']
                n = kwargs['n']
                clear_previous_book_recommendations(uid)
                top_n = get_top_n(uid, self.trainset, self.algo, n)
                save_book_recommendations(top_n, uid)
            elif action == 'top_n_for_genre':
                uid = kwargs['id']
                n = kwargs['n']
                genre = kwargs['genre']
                clear_previous_book_recommendations(uid, genre)
                top_n = get_top_n_for_genre(uid, self.trainset, self.algo, genre, n)
                save_book_recommendations(top_n, uid, genre)
            elif action == 'top_n_for_club':
                club = kwargs['id']
                n = kwargs['n']
                pred_lookup = generate_pred_set(self.pred)
                clear_previous_book_recommendations_for_club(club)
                top_n = get_top_n_for_club(club, self.trainset, self.algo, pred_lookup, n)
                save_book_recommendations_for_club(top_n, club)
            elif action == 'top_n_for_club_for_genre':
                club = kwargs['id']
                n = kwargs['n']
                genre = kwargs['genre']
                pred_lookup = generate_pred_set(self.pred)
                clear_previous_book_recommendations_for_club(club, genre)
                top_n = get_top_n_for_club_for_genre(club, self.trainset, self.algo, pred_lookup, genre, n)
                save_book_recommendations_for_club(top_n, club, genre)
            elif action == 'top_n_global':
                n = kwargs['n']
                clear_previous_global_recommendations()
                top_n = get_global_top_n(self.dataframe, self.trainset.global_mean, n)
                save_global_book_recommendations(top_n)
            elif action == 'top_n_global_for_genre':
                n = kwargs['n']
                genre = kwargs['genre']
                clear_previous_global_recommendations(genre)
                top_n = get_global_top_n_for_genre(self.dataframe, self.trainset.global_mean, genre, n)
                save_global_book_recommendations(top_n, genre)
            elif action == 'top_n_users_top_books':
                uid = kwargs['id']
                n = kwargs['n']
                clear_previous_user_recommendations(uid, 'top_books')
                top_n = get_top_n_users_by_favourite_books(uid, self.trainset, self.algo, n)
                save_user_recommendations(top_n, uid, method='top_books')
            elif action == 'top_n_users_random_books':
                uid = kwargs['id']
                n = kwargs['n']
                clear_previous_user_recommendations(uid, 'random_books')
                top_n = get_top_n_users_double_random(uid, self.trainset, self.algo, n)
                save_user_recommendations(top_n, uid, method='random_books')
            elif action == 'top_n_users_genre_books':
                uid = kwargs['id']
                n = kwargs['n']
                genre = kwargs['genre']
                clear_previous_user_recommendations(uid, 'genre_books ' + genre)
                top_n = get_top_n_users_for_a_genre(uid, self.trainset, self.algo, genre, n)
                save_user_recommendations(top_n, uid, method='genre_books ' + genre)
            elif action == 'top_n_clubs_top_user_books':
                uid = kwargs['id']
                n = kwargs['n']
                clubs = list(Club.objects.all())
                clear_previous_club_recommendations(uid, 'top_user_books')
                top_n = get_top_n_clubs_using_top_items_for_a_user(uid, self.algo, self.trainset, clubs, n)
                save_club_recommendations(top_n, uid, method='top_user_books')
            elif action == 'top_n_clubs_random_books':
                uid = kwargs['id']
                n = kwargs['n']
                clubs = list(Club.objects.all())
                clear_previous_club_recommendations(uid, 'random_books')
                top_n = get_top_n_clubs_using_random_items(uid, self.algo, self.trainset, clubs, n)
                save_club_recommendations(top_n, uid, method='random_books')
            elif action == 'top_n_clubs_genre_books':
                uid = kwargs['id']
                n = kwargs['n']
                genre = kwargs['genre']
                clear_previous_club_recommendations(uid, 'genre_books ' + genre)
                clubs = list(Club.objects.all())
                top_n = get_top_n_clubs_for_a_genre(uid, self.algo, self.trainset, clubs, genre, n)
                save_club_recommendations(top_n, uid, method='genre_books ' + genre)
            elif action == 'top_n_clubs_top_club_books':
                uid = kwargs['id']
                n = kwargs['n']
                clubs = list(Club.objects.all())
                clear_previous_club_recommendations(uid, 'top_club_books')
                top_n = get_top_n_clubs_using_clubs_books(uid, self.algo, clubs, n)
                save_club_recommendations(top_n, uid, method='top_club_books')
            else:
                return Response(data='You need to provide a correct action', status=status.HTTP_404_NOT_FOUND)
            return Response(data=top_n, status=status.HTTP_200_OK)
        except KeyError:
            return Response(data='You need to provide correct parameters', status=status.HTTP_404_NOT_FOUND)


def save_book_recommendations(top_n, uid, genre='Unspecified'):
    for isbn, rat in top_n:
        br = BookRecommendation.objects.create(
            user=User.objects.get(pk=uid),
            book=Book.objects.get(ISBN=isbn),
            rating=rat,
            genre=genre
        )
        br.save()


def clear_previous_book_recommendations(uid, genre='Unspecified'):
    BookRecommendation.objects.filter(user=uid, genre=genre).delete()


def save_book_recommendations_for_club(top_n, club, genre='Unspecified'):
    for isbn, rat in top_n:
        br = BookRecommendationForClub.objects.create(
            club=Club.objects.get(pk=club),
            book=Book.objects.get(ISBN=isbn),
            rating=rat,
            genre=genre
        )
        br.save()


def clear_previous_book_recommendations_for_club(club, genre='Unspecified'):
    BookRecommendationForClub.objects.filter(club=club, genre=genre).delete()


def save_global_book_recommendations(top_n, genre='Unspecified'):
    for isbn, r, n, wr in top_n:
        br = GlobalBookRecommendation.objects.create(
            book=Book.objects.get(ISBN=isbn),
            weighted_rating=wr,
            number_of_ratings=n,
            flat_rating=r,
            genre=genre
        )
        br.save()


def clear_previous_global_recommendations(genre='Unspecified'):
    GlobalBookRecommendation.objects.filter(genre=genre).delete()


def save_user_recommendations(top_n, uid, method='Unspecified'):
    for user, diff in top_n:
        ur = UserRecommendation.objects.create(
            user=User.objects.get(pk=uid),
            recommended_user=User.objects.get(pk=user),
            diff=diff,
            method=method
        )
        ur.save()


def clear_previous_user_recommendations(uid, method='Unspecified'):
    UserRecommendation.objects.filter(user=uid, method=method).delete()


def save_club_recommendations(top_n, uid, method='Unspecified'):
    for club, diff in top_n:
        cr = ClubRecommendation.objects.create(
            user=User.objects.get(pk=uid),
            club=Club.objects.get(pk=club),
            diff=diff,
            method=method
        )
        cr.save()


def clear_previous_club_recommendations(uid, method='Unspecified'):
    ClubRecommendation.objects.filter(user=uid, method=method).delete()
