# Messaging implementation from: https://channels.readthedocs.io tutorial
from django.urls import path
from xml.etree.ElementInclude import include
from django.urls import path
from app.views.static_views import UserView
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
    path('users', UserView.as_view()),
]
