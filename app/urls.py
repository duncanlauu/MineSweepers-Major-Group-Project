from django.urls import path

from app.views.feed_views import AllPostsView, FeedView, PostView
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    path('feed/', FeedView.as_view(), name='feed'),
    path('posts/', AllPostsView.as_view(), name='all_posts'),
    path('posts/<int:post_id>', PostView.as_view(), name='post')
]
