from django.urls import path
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist')
    path('feed/')
    path('posts/')
    path('posts/<int:post_id>')
]
