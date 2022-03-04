from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from app.models import User


class FriendsView(APIView):
    """API View of friends of user"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get list of friends of current user"""
        friends = request.user.friends.all()
        return Response({'friends': friends}, status=status.HTTP_200_OK)

    def delete(self, request):
        """Delete a friend based on request parameter"""
        try:
            user = request.user
            other_user_id = request.data['other_user_id']
            other_user = User.objects.get(id=other_user_id)
            user.remove_friend(other_user)
            other_user.remove_friend(user)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FriendRequestsView(APIView):
    """API View of friend requests related to user"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get list of incoming and outgoing friend requests of user"""
        user = request.user
        outgoing = user.outgoing_friend_requests.values('receiver', 'created_at')
        incoming = user.incoming_friend_requests.values('sender', 'created_at')
        return Response({'incoming': incoming, 'outgoing': outgoing}, status=status.HTTP_200_OK)

    def post(self, request):
        """Send a friend request to another user based on request parameter"""
        try:
            user = request.user
            other_user_id = request.data['other_user_id']
            other_user = User.objects.get(id=other_user_id)
            user.send_friend_request(other_user)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Either accept, reject, or cancel friend request of another user based on request parameter"""
        try:
            user = request.user
            other_user_id = request.data['other_user_id']
            other_user = User.objects.get(id=other_user_id)
            if request.data['action'] == 'accept':
                user.accept_friend_request(other_user)
                return Response(status=status.HTTP_200_OK)
            elif request.data['action'] == 'reject':
                user.reject_friend_request(other_user)
                return Response(status=status.HTTP_200_OK)
            elif request.data['action'] == 'cancel':
                user.cancel_friend_request(other_user)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
