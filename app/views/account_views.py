from app.models import User, FriendRequest
from ..serializers import RegisterUserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


# from https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3
class CreateUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # keep this AllowAny
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            new_user = reg_serializer.save()
            if new_user:
                return Response(status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # make this isAuthenticated
        try:
            user = request.user
            other_user = User.objects.get(pk=kwargs['id'])
            serializer = RegisterUserSerializer(other_user)
            returned_data = serializer.data
            user_sent_request = FriendRequest.objects.filter(sender=user, receiver=other_user).exists()
            user_is_friends = other_user in list(user.friends.all())
            returned_data['user_sent_request'] = user_sent_request
            returned_data['user_is_friends'] = user_is_friends
            return Response(returned_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        # make this isAuthenticated
        user = User.objects.get(pk=kwargs['id'])
        serializer = RegisterUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

