from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AppSerializer
from .models import User

class FrontendView(viewsets.ModelViewSet):
    serializer_class = AppSerializer
    queryset = User.objects.all()
