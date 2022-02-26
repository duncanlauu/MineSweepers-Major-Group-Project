from django.urls import path
from .frontend_views import dino, index

urlpatterns = [
    path('', index, name="landing_page"),
    path('home/', index, name="home"),
    path('dino.html', dino),
    path('log_in/', index, name="login"),
    path('log_out/', index, name="logout"),
    path('sign_up/', index, name="signup"),
    path('club_profile/', index, name="clubprofile"),  # /<int:club_id>
    path('error/', dino, name="error"),
    path('chat/<chatID>', index, name="chat"),
    path('chatv2/<chatID>', index, name="chatv2")

]
