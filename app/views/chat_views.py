# Messaging implementation from: https://channels.readthedocs.io tutorial
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.utils.safestring import mark_safe
import json

def index(request):
    return render(request, 'chat_templates/index.html')

@login_required
def room(request, room_name):
    return render(request, 'chat_templates/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name)),
        'username': mark_safe(json.dumps(request.user.username)),
    })
