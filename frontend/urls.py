from django.urls import path
from .frontend_views import dino, index

urlpatterns = [
    path('', index, name="home"),
    path('error/', dino, name="error")
]