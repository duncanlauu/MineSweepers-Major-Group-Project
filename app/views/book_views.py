from app.models import Book
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from app.serializers import BookSerializer
from rest_framework.permissions import IsAuthenticated

class Books(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            book = Book.objects.get(ISBN=kwargs['ISBN'])
            serializer = BookSerializer(book)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Book.DoesNotExist:
            return Response(data='There is no book with the requested ISBN',status=status.HTTP_400_BAD_REQUEST)