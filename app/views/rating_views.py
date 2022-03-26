from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app.models import Book, BookRating
from app.serializers import BookRatingSerializer

class AllRatingsView(APIView):
    """API View of all ratings of logged in user"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all ratings of logged in user"""
        user = request.user
        user_ratings = BookRating.objects.filter(user=user)
        serializer = BookRatingSerializer(user_ratings, many=True)
        return Response({'ratings': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        """Create new rating by logged in user for a particular book"""
        user = request.user
        book_id = request.data['book']
        rating_exists = BookRating.objects.filter(book_id=book_id, user_id=user.id).exists()

        if not rating_exists:
            data = request.data.copy()
            data['user'] = user.id
            serializer = BookRatingSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
class RatingView(APIView):
    """API View of any singular rating"""

    permission_classes = [IsAuthenticated]

    def get(self, request, rating_id):
        """Get any rating"""
        try:
            rating = BookRating.objects.get(id=rating_id)
            serializer = BookRatingSerializer(rating)
            return Response({'rating': serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, rating_id):
        """Edit rating only if author of rating is logged in user"""
        try:
            user = request.user
            rating = BookRating.objects.get(id=rating_id)
            if rating.user == user: # can edit rating if user is author of rating
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