
from django.urls import path
from .frontend_views import dino, index

urlpatterns = [
    path('', index, name="home"),
    path('dino.html', dino),
    path('log_in/', index, name="login"),
    path('sign_up/', index, name="signup"),
    path('club_profile/', index, name="clubprofile"),  # /<int:club_id>
    path('error/', dino, name="error"),
    path('dummy2', index, name="dummy"),
    path('home/', index, name="home")
]
