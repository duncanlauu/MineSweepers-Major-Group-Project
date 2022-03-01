from django.urls import path, include
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView
from django.contrib.auth import views as auth_views

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    # Reset User Password
    path('auth/', include('djoser.urls')),
]
