from xml.etree.ElementInclude import include
from django.urls import path
from app.views.static_views import UserView

urlpatterns = [
    path('users', UserView.as_view()),
]