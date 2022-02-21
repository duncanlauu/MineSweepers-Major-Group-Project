from tempfile import TemporaryFile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app.models import User


class FriendsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        friends = request.user.friends.all()
        return Response({'friends': friends}, status=status.HTTP_200_OK)
    
    def put(self, request):
        try:
            user = request.user
            other_user_id = request.data['other_user_id']
            other_user = User.objects.get(pk=other_user_id)

            if request.data['action'] == 'send':
                user.send_friend_request(other_user)
                return Response(status=status.HTTP_200_OK)
            elif request.data['action'] == 'accept':
                user.accept_friend_request(other_user)
                return Response(status=status.HTTP_200_OK)
            elif request.data['action'] == 'reject':
                user.reject_friend_request(other_user)
                return Response(status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            user = request.user
            other_user_id = request.data['other_user_id']
            other_user = User.objects.get(pk=other_user_id)
            user.remove_friend(other_user)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

