"""Static views of the app."""
from django.shortcuts import render
from app.helpers import login_prohibited

# View modified from Clucker
@login_prohibited
def home(request):
    return render(request, 'home.html')

# should be login_required
def dummy(request):
    return render(request, 'dummy.html')
