# Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from rest_framework.views import APIView
from app.models import Chat
from app.serializers import ChatSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.core.exceptions import PermissionDenied

User = get_user_model()

def get_user(username):
    user = get_object_or_404(User, username=username)
    return user


class ChatListView(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if(self.request.user.username != username):
            raise PermissionDenied({"error": ["You can't request other users chats"]})
        else:
            queryset = Chat.objects.all()
            user = get_user(username)
            queryset = user.chats.all()
            return queryset


# class ChatDetailView(RetrieveAPIView):
#     queryset = Chat.objects.all()
#     serializer_class = ChatSerializer
#     permission_classes = (permissions.IsAuthenticated, )

#     def get(self, request, *args, **kwargs):
#         chat = Chat.objects.get(pk = self.kwargs['pk'])
#         print(chat)
#         # if(self.request.user.username != username):
#         #     return Response(status=status.HTTP_403_FORBIDDEN)
#         # else:
#         #     queryset = Chat.objects.all()
#         #     user = get_user(username)
#         #     queryset = user.chats.all()
#         #     return queryset

class ChatLeaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, *args, **kwargs):
        try:
            user = request.user
            chat = Chat.objects.get(pk = self.kwargs['pk'])
            if(user in chat.participants.all()):
                chat.participants.remove(user)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE) #maybe change to something else
                
        except:
             return Response(status=status.HTTP_400_BAD_REQUEST)

#Helpers
def get_last_10_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-timestamp').all()[:10]

def get_current_chat(chatId):
    print(chatId)
    return get_object_or_404(Chat, id=chatId)
