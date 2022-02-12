# Messaging implementation from: https://channels.readthedocs.io tutorial
from django.shortcuts import render, get_object_or_404
from app.models import User, Chat, Contact

def get_last_10_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-timestamp').all()[:10]

def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    return get_object_or_404(Contact, user=user)

def get_current_chat(chatId):
    print(chatId)
    return get_object_or_404(Chat, id=chatId)
