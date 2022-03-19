from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.recommender_system.genre_algo import get_top_n_merged_genres


class GenresView(APIView):
    """This is an API to get the top n genres"""

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if 'n' not in request.query_params:
            return Response(data='You need to provide the number of genres you want to get',
                            status=status.HTTP_400_BAD_REQUEST)
        genres = get_top_n_merged_genres(int(request.query_params['n']))
        return Response(data=genres, status=status.HTTP_200_OK)
