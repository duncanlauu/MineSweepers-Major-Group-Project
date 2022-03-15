# Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.generics import ListAPIView
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
    
    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        response_list = serializer.data

        for response in response_list:
            last_message = get_last_message(response["id"])
            if(last_message == None):
                chat = Chat.objects.get(pk = response["id"])
                response["last_message"] = ""
                response["last_update"] = chat.created_at
            else:
                response["last_message"] = last_message.content
                response["last_update"] = last_message.timestamp
    
        return Response(serializer.data)

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
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE) #maybe change to something else (403?)
                
        except:
             return Response(status=status.HTTP_400_BAD_REQUEST)

#Helpers
def get_last_10_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-timestamp').all()[:10]

def get_all_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-timestamp').all()

def get_last_message(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    last_message_list = chat.messages.order_by('-timestamp').all()[:1]
    if(len(last_message_list) < 1):
        return None
    else:
        return last_message_list[0] #lol refactor

def get_current_chat(chatId):
    return get_object_or_404(Chat, id=chatId)
