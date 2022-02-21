from app.models import Club, User
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render


@login_required
def accept_friend_request(request):
    current_user = request.user
    return render(request, 'dummy.html')