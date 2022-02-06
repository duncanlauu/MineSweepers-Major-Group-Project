from django.conf import settings
from django.views.generic.edit import FormView
from django.contrib.auth import login
from .mixins import LoginProhibitedMixin
from app.forms import CreateClubForm
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

@login_required
def create_club(request):
    current_user = request.user
    if request.method == 'POST':
        form = CreateClubForm(request.POST)
        if form.is_valid():
            form.save(current_user)
            return redirect('home')
    else:
        form = CreateClubForm()
    return render(request, 'create_club.html', {'form': form})
