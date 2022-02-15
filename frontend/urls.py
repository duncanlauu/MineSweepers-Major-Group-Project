from django.urls import path
from .frontend_views import dino, index

urlpatterns = [
    path('', index),
    path('dino.html', dino),
    path('log_in/', index),
    path('', index, name="home"),
    path('error/', dino, name="error")
]
