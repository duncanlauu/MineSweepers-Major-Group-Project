
from itertools import chain
from django.views.generic import ListView
from app.models import Club, User, Book
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, get_trainset_from_dataset, load_trained_model
from app.serializers import ClubSerializer, UserSerializer, BookSerializer
from recommender_system.search_functions import get_top_between_m_and_n_users_for_search, get_top_between_m_and_n_clubs_for_search
import json


# source : https://www.codingforentrepreneurs.com/blog/a-multiple-model-django-search-engine

class SearchView(ListView, APIView):

    # def get_context_data(self, **kwargs):
    #     context = super().get_context_data(**kwargs)
    #     context["count"] = self.count or 0
    #     context['query'] = self.request.GET.get('q')
    #     return context
    
    def get(self, request, *args, **kwargs):
        request = self.request
        # query = request.GET.get('q', None)
        query = request.data['search_string']

        
        if query is not None:
            book_results = Book.objects.search(query)
            club_results = Club.objects.search(query)
            user_results = User.objects.search(query)

            serilized_book_results = BookSerializer(book_results, many=True)
            serilized_club_results = ClubSerializer(club_results, many=True)
            serilized_user_results = UserSerializer(user_results, many=True)



            csv_file_path = 'app/files/BX-Book-Ratings.csv'
            dump_file_name = 'app/files/dump_file'
            dataframe = get_combined_data(csv_file_path)
            data = get_dataset_from_dataframe(dataframe)
            trainset = get_trainset_from_dataset(data)
            pred, algo = load_trained_model(dump_file_name)
         
            

            #recomended_book_results 
            recommended_club_results = get_top_between_m_and_n_clubs_for_search(request.user, book_results, club_results, algo, 0, 20)
            recommended_user_results =get_top_between_m_and_n_users_for_search(request.user, book_results, trainset, algo, 0, 20)
            results = {
                "books": serilized_book_results.data,
                "clubs": serilized_club_results.data,
                "users": serilized_user_results.data,
                # "recommended_books": recomended_book_results.data,
                "recomended_clubs": recommended_club_results.data,
                "recomended_users": recommended_user_results.data
                }
            


            return Response(json.dumps(results), status=status.HTTP_200_OK)
            
        return Response(status=status.HTTP_400_BAD_REQUEST)

