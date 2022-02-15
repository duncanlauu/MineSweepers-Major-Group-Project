"""Static views of the app."""
from django.shortcuts import render
from app.helpers import login_prohibited
from rest_framework import generics
from app.models import User
from app.serializers import UserSerializer

# View modified from Clucker
@login_prohibited
def home(request):
    return render(request, 'home.html')

# should be login_required
def dummy(request):
    return render(request, 'dummy.html')

class UserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer