"""Static views of the app."""
from django.shortcuts import render
from app.helpers import login_prohibited

@login_prohibited
def home(request):
    return render(request, 'home.html')

def dummy(request):
    return render(request, 'dummy.html')
