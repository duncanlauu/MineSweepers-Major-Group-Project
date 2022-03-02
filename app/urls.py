from django.urls import path

from app.views.friend_views import FriendRequestsView, FriendsView, FriendView
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    path('friends/', FriendsView.as_view(), name='friends'),
    path('friend/<int:other_user_id>', FriendView.as_view(), name='friends'),
    path('friend_requests/', FriendRequestsView.as_view(), name='friend_requests')
]
