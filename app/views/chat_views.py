# Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from app.models import Chat, User
from app.serializers import ChatSerializer
from rest_framework import status
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied
from app.helpers import get_user, get_last_message

class ChatListView(ListAPIView):
    """API List View for Chat Model"""
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get list of chats for a user"""
        username = self.request.query_params.get('username', None)
        if self.request.user.username != username:
            raise PermissionDenied({"error": ["You can't request other users chats"]})
        else:
            queryset = Chat.objects.all()
            user = get_user(username)
            queryset = user.chats.all()
            return queryset

    def list(self, request, *args, **kwargs):
        """Adds additional informtion to user chat list"""
        serializer = self.get_serializer(self.get_queryset(), many=True)
        response_list = serializer.data
        for response in response_list:
            last_message = get_last_message(response["id"])
            if last_message is None:
                chat = Chat.objects.get(pk=response["id"])
                response["last_message"] = ""
                response["last_update"] = chat.created_at
            else:
                response["last_message"] = last_message.content
                response["last_update"] = last_message.timestamp

        return Response(serializer.data)


class ChatLeaveView(APIView):
    """API View to leave a chat"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """Removes the user from chat participants"""
        try:
            user = request.user
            chat = Chat.objects.get(pk=self.kwargs['pk'])
            if user in chat.participants.all():
                chat.participants.remove(user)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)

        except Chat.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
