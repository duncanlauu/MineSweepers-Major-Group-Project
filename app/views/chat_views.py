# Messaging implementation from: https://channels.readthedocs.io tutorial
from django.shortcuts import render

def index(request):
    return render(request, 'chat_templates/index.html')

def room(request, room_name):
    return render(request, 'chat_templates/room.html', {
        'room_name': room_name
    })
