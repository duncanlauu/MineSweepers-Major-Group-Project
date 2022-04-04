from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app.models import Book, BookRating, User
from app.serializers import BookRatingSerializer, BookSerializer


class AllRatingsView(APIView):
    """API View of all ratings of logged in user"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all ratings of logged in user"""
        user = request.user
        user_ratings = BookRating.objects.filter(user=user)\
            .values("id",
                    "user",
                    "book__ISBN",
                    "book__title",
                    "book__image_links_small",
                    "rating",
                    "created_at")
        return Response({'ratings': user_ratings}, status=status.HTTP_200_OK)

    def post(self, request):
        """Create new rating by logged in user for a particular book"""
        user = request.user
        book_id = request.data['book']
        rating_exists = BookRating.objects.filter(
            book_id=book_id, user_id=user.id).exists()

        print('rating_exists', rating_exists)
        print('book id' + book_id)

        if not rating_exists:
            print('rating does not exist')
            data = request.data.copy()
            data['user'] = user.id
            serializer = BookRatingSerializer(data=data)
            if serializer.is_valid():
                print('serializer is valid')
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class RatingView(APIView):
    """API View of any singular rating"""

    permission_classes = [IsAuthenticated]

    def get(self, request, rating_id):
        """Get any rating"""
        try:
            rating = BookRating.objects.get(id=rating_id)
            book = Book.objects.get(ISBN=rating.book_id)
            ratings_data = BookRatingSerializer(rating).data
            book_data = BookSerializer(book).data
            return Response({'rating': ratings_data, 'book_data': book_data}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, rating_id):
        """Edit rating only if author of rating is logged in user"""
        try:
            user = request.user
            rating = BookRating.objects.get(id=rating_id)
            if rating.user == user:  # can edit rating if user is author of rating
                new_rating = request.data['rating']
                rating.update_rating(new_rating)
                return Response({'updated': 'true'}, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, rating_id):
        """Delete rating only if author of rating is logged in user"""
        rating = BookRating.objects.get(id=rating_id)
        if rating.user == request.user:
            rating.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class OtherUserRatingsView(APIView):
    """API View of ratings of another user"""

    permission_classes = [IsAuthenticated]

    def get(self, request, other_user_id):
        """Get ratings of another user"""
        try:
            other_user = User.objects.get(pk=other_user_id)
            ratings = BookRating.objects.filter(user=other_user) \
                .values("id",
                        "user",
                        "book__ISBN",
                        "book__title",
                        "book__image_links_small",
                        "rating",
                        "created_at")
            return Response(ratings, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class BookRatingsView(APIView):
    """API View of all ratings of a particular book"""

    permission_classes = [IsAuthenticated]

    def get(self, request, isbn):
        """Get all ratings of a particular book"""
        try:
            book = Book.objects.get(pk=isbn)
            book_ratings = BookRating.objects.filter(book=book)
            serializer = BookRatingSerializer(book_ratings, many=True)
            return Response({'ratings': serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
