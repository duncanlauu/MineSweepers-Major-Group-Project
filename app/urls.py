from django.urls import path, include
from app.views.friend_views import FriendRequestsView, FriendsView, FriendView
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView, GetCurrentUserView
from .views.recommender_views import RecommenderAPI
from .views.static_views import HelloWorldView
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView
from django.contrib.auth import views as auth_views
from .views.chat_views import (
    ChatListView,
    ChatDetailView,
    ChatLeaveView
)
from .views.club_views import Clubs, SingleClub

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),

    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    path('friends/', FriendsView.as_view(), name='friends'),
    path('friend/<int:other_user_id>', FriendView.as_view(), name='friends'),
    path('friend_requests/', FriendRequestsView.as_view(), name='friend_requests'),
    path('get_current_user/', GetCurrentUserView.as_view(), name='current_user'),
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    # Reset User Password
    path('auth/', include('djoser.urls')),
    # Chat
    path('chat/', ChatListView.as_view()),
    path('chat/<pk>', ChatDetailView.as_view()),
    path('chat/<pk>/leave/', ChatLeaveView.as_view()),

    # Recommender system
    path('recommender/', RecommenderAPI.as_view(), name='recommender'),
    path('recommender/<str:action>/', RecommenderAPI.as_view(), name='recommender_action'),
    path('recommender/<int:m>/<int:n>/<int:id>/<str:action>/', RecommenderAPI.as_view(), name='recommender_top_n'),
    path('recommender/<int:m>/<int:n>/<int:id>/<str:action>/<str:genre>/', RecommenderAPI.as_view(),
         name='recommender_top_n_for_genre'),
    path('recommender/<int:m>/<int:n>/<str:action>/', RecommenderAPI.as_view(), name='recommender_top_n_global'),
    path('recommender/<int:m>/<int:n>/<str:action>/<str:genre>/', RecommenderAPI.as_view(),
         name='recommender_top_n_global_for_genre'),

    # Club API
    path('user/get_update/<int:id>/', CreateUser.as_view(), name="get_update"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    path('clubs/', Clubs.as_view(), name='clubs'),
    path('clubs/<int:id>/', SingleClub.as_view(), name='retrieve_single_club'),
    path('clubs/<int:id>/<str:action>/<int:user_id>', SingleClub.as_view(), name='manage_club'),
    path('clubs/<int:id>/<str:action>/', SingleClub.as_view(), name='update_club')
]
