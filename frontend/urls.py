from django.urls import path, re_path
from .frontend_views import dino, index

urlpatterns = [
    path('', index, name="landing_page"),
    re_path(r'^.*/$', index)  # for all other urls
]
