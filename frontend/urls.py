from django.urls import path
from .views import dino, index

urlpatterns = [
    path('', index),
    path('dino.html', dino)
]