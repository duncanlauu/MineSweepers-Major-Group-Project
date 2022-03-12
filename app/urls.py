from django.urls import path
from app.views.feed_views import AllCommentsView, AllPostsView, AllRepliesView, CommentView, FeedView, PostView, ReplyView
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView, GetCurrentUserView
from .views.recommender_views import RecommenderAPI
from .views.static_views import HelloWorldView
from .views.authentication_views import BlacklistTokenView

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),

    # Friends
    path('friends/', FriendsView.as_view(), name='friends'),
    path('friend/<int:other_user_id>', FriendView.as_view(), name='friends'),
    path('friend_requests/', FriendRequestsView.as_view(), name='friend_requests'),
    path('get_current_user/', GetCurrentUserView.as_view(), name='current_user'),
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    
    # Reset User Password
    path('auth/', include('djoser.urls')),

    # Recommender system
    path('recommender/', RecommenderAPI.as_view(), name='recommender'),
    path('recommender/<str:action>/', RecommenderAPI.as_view(), name='recommender_action'),
    path('recommender/<int:n>/<int:id>/<str:action>/', RecommenderAPI.as_view(), name='recommender_top_n'),
    path('recommender/<int:n>/<int:id>/<str:action>/<str:genre>/', RecommenderAPI.as_view(),
         name='recommender_top_n_for_genre'),
    path('recommender/<int:n>/<str:action>/', RecommenderAPI.as_view(), name='recommender_top_n_global'),
    path('recommender/<int:n>/<str:action>/<str:genre>/', RecommenderAPI.as_view(),
         name='recommender_top_n_global_for_genre'),

    # Feed
    path('feed/', FeedView.as_view(), name='feed'),
    path('posts/', AllPostsView.as_view(), name='all_posts'),
    path('posts/<int:post_id>', PostView.as_view(), name='post'),
    path('posts/<int:post_id>/comments/', AllCommentsView.as_view(), name='all_comments'),
    path('posts/<int:post_id>/comments/<int:comment_id>', CommentView.as_view(), name='comment'),
    path('posts/<int:post_id>/comments/<int:comment_id>/replies/', AllRepliesView.as_view(), name='all_replies'),
    path('posts/<int:post_id>/comments/<int:comment_id>/replies/<int:reply_id>', ReplyView.as_view(), name='reply')
]
