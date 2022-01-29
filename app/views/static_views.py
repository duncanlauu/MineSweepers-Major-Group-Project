"""Static views of the app."""
from django.shortcuts import render
# from microblogs.helpers import login_prohibited

# @login_prohibited
def home(request):
    return render(request, 'home.html')
