# Messaging implementation from: https://channels.readthedocs.io tutorial
from django.shortcuts import render, get_object_or_404
from app.models import Chat

def get_last_10_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-timestamp').all()[:10]
