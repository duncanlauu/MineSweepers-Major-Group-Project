import time

from django.views.generic import ListView
from app.models import Club, User, Book
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset, load_trained_model
from app.serializers import ClubSerializer, UserSerializer, BookSerializer
from app.recommender_system.search_functions import get_top_between_m_and_n_users_for_search, \
    get_top_between_m_and_n_clubs_for_search, order_books_based_on_recommendations
import json


# source : https://www.codingforentrepreneurs.com/blog/a-multiple-model-django-search-engine

class SearchView(ListView, APIView):
    """This is an API for search"""

    # def get_context_data(self, **kwargs):
    #     context = super().get_context_data(**kwargs)
    #     context["count"] = self.count or 0
    #     context['query'] = self.request.GET.get('q')
    #     return context

    def get(self, request, *args, **kwargs):
        request = self.request
        print(request.query_params)

        if 'search_query' in request.query_params and request.query_params['search_query'] != '':
            query = request.query_params['search_query']
            book_results = Book.objects.search(query)
            club_results = Club.objects.search(query)[:10]
            user_results = User.objects.search(query)[:10]

            serialized_club_results = ClubSerializer(club_results, many=True)
            serialized_user_results = UserSerializer(user_results, many=True)

            csv_file_path = 'app/files/BX-Book-Ratings-filtered.csv'
            dump_file_name = 'app/files/dump_file'
            dataframe = get_combined_data(csv_file_path)
            data = get_dataset_from_dataframe(dataframe)
            trainset = get_trainset_from_dataset(data)
            pred, algo = load_trained_model(dump_file_name)

            ordered_books = order_books_based_on_recommendations(book_results, algo, request.user.id)[:10]

            serialized_book_results = BookSerializer(ordered_books, many=True)

            start = time.time()
            recommended_club_results = get_top_between_m_and_n_clubs_for_search(request.user, ordered_books,
                                                                                club_results, algo, 0, 20)
            recommended_user_results = get_top_between_m_and_n_users_for_search(request.user, ordered_books, trainset,
                                                                                algo, 0, 20)

            serialized_recommended_club_results = ClubSerializer(
                list((Club.objects.get(pk=club_tuple[0]) for club_tuple in recommended_club_results)), many=True)
            serialized_recommended_user_results = UserSerializer(
                list((User.objects.get(pk=user_tuple[0]) for user_tuple in recommended_user_results)), many=True)

            results = {
                "books": serialized_book_results.data,
                "clubs": serialized_club_results.data,
                "users": serialized_user_results.data,
                "recommended_clubs": serialized_recommended_club_results.data,
                "recommended_users": serialized_recommended_user_results.data
            }

            end = time.time()
            print(end - start)

            return Response(json.dumps(results), status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)
