import time

from django.views.generic import ListView
from app.models import Club, User, Book
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.serializers import ClubSerializer, UserSerializer, BookSerializer
import json

# Search Django database with query LookUp
# https://www.codingforentrepreneurs.com/blog/a-multiple-model-django-search-engine

class SearchView(ListView, APIView):
    """This is an API for search"""

    def get(self, request, *args, **kwargs):
        if 'search_query' in request.query_params and request.query_params['search_query'] != '':
            query = request.query_params['search_query']
            book_results = Book.objects.search(query)[:10]
            club_results = Club.objects.search(query)[:10]
            user_results = User.objects.search(query)[:10]

            serialized_book_results = BookSerializer(book_results, many=True)
            serialized_club_results = ClubSerializer(club_results, many=True)
            serialized_user_results = UserSerializer(user_results, many=True)

            results = {
                "books": serialized_book_results.data,
                "clubs": serialized_club_results.data,
                "users": serialized_user_results.data
            }

            return Response(json.dumps(results), status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)
