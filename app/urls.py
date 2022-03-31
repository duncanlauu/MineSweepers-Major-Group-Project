from django.urls import path, include
from .views import *

app_name = 'app'

urlpatterns = [
    # User Auth
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),

    # Reset User Password
    path('auth/', include('djoser.urls')),

    # Books
    path('books/<str:ISBN>', Books.as_view(), name="retrieve_book"),

    # Friends
    path('friends/', FriendsView.as_view(), name='friends'),
    path('friends/user/<int:other_user_id>', OtherUserFriendsView.as_view(), name='other_user_friends'),
    path('friends/<int:other_user_id>', FriendView.as_view(), name='single_friend'),
    path('friend_requests/', FriendRequestsView.as_view(), name='friend_requests'),

    # Chat
    path('chat/', ChatListView.as_view()),
    path('chat/leave/<pk>/', ChatLeaveView.as_view()),

    # Recommender system
    path('recommender/', RecommenderAPI.as_view(), name='recommender'),
    path('recommender/<str:action>/', RecommenderAPI.as_view(), name='recommender_action'),
    path('recommender/<int:m>/<int:n>/<int:id>/<str:action>/', RecommenderAPI.as_view(), name='recommender_top_n'),
    path('recommender/<int:m>/<int:n>/<int:id>/<str:action>/<str:genre>/', RecommenderAPI.as_view(),
         name='recommender_top_n_for_genre'),
    path('recommender/<int:m>/<int:n>/<str:action>/', RecommenderAPI.as_view(), name='recommender_top_n_global'),
    path('recommender/<int:m>/<int:n>/<str:action>/<str:genre>/', RecommenderAPI.as_view(),
         name='recommender_top_n_global_for_genre'),

    # Feed
    path('feed/', FeedView.as_view(), name='feed'),
    path('posts/', AllPostsView.as_view(), name='all_posts'),
    path('posts/<int:post_id>', PostView.as_view(), name='post'),
    path('posts/<int:post_id>/comments/', AllCommentsView.as_view(), name='all_comments'),
    path('posts/<int:post_id>/comments/<int:comment_id>', CommentView.as_view(), name='comment'),
    path('posts/<int:post_id>/comments/<int:comment_id>/replies/', AllRepliesView.as_view(), name='all_replies'),
    path('posts/<int:post_id>/comments/<int:comment_id>/replies/<int:reply_id>', ReplyView.as_view(), name='reply'),
    path('feed/clubs/<int:club_id>', ClubFeedView.as_view(), name='club_feed'),

    # Club API
    path('user/get_update/<int:id>/', CreateUser.as_view(), name="get_update"),
    path('clubs/', Clubs.as_view(), name='clubs'),
    path('clubs/user/<int:user_id>', UserClubView.as_view(), name='user_clubs'),
    path('singleclub/<int:id>/', SingleClub.as_view(), name='retrieve_single_club'),
    path('singleclub/<int:id>/<str:action>/<int:user_id>', SingleClub.as_view(), name='manage_club'),
    path('singleclub/<int:id>/<str:action>/', SingleClub.as_view(), name='update_club'),

    # Search API
    path('search/', SearchView.as_view(), name='search'),

    # Ratings
    path('ratings/', AllRatingsView.as_view(), name='user_ratings'),
    path('ratings/<int:rating_id>/', RatingView.as_view(), name='rating'),
    path('books/<str:isbn>/ratings/', BookRatingsView.as_view(), name='book_ratings'),
    path('ratings/other_user/<int:other_user_id>', OtherUserRatingsView.as_view(), name='other_user_ratings'),

    # Others
    path('get_current_user/', GetCurrentUserView.as_view(), name='current_user'),

    # Genre API
    path('genres/', GenresView.as_view(), name='genres'),

    # Feed
    path('feed/', FeedView.as_view(), name='feed'),
    path('posts/', AllPostsView.as_view(), name='all_posts'),
    path('posts/<int:post_id>', PostView.as_view(), name='post'),
    path('posts/user/<int:other_user_id>', OtherUserPostsView.as_view(), name='other_user_posts'),
    path('posts/<int:post_id>/comments/', AllCommentsView.as_view(), name='all_comments'),
    path('posts/<int:post_id>/comments/<int:comment_id>', CommentView.as_view(), name='comment'),
    path('posts/<int:post_id>/comments/<int:comment_id>/replies/', AllRepliesView.as_view(), name='all_replies'),
    path('posts/<int:post_id>/comments/<int:comment_id>/replies/<int:reply_id>', ReplyView.as_view(), name='reply'),

    # Scheduling API
    path('scheduling/', SchedulingView.as_view(), name='scheduling'),
    path('scheduling/<int:id>/', SchedulingView.as_view(), name='scheduling_with_id'),
    path('scheduling/<int:id>/<str:action>/', SchedulingView.as_view(), name='scheduling_update'),
    path('calendar/', CalendarView.as_view(), name='calendar'),
    path('calendar/<int:id>', CalendarView.as_view(), name='calendar_with_id'),
    path('meetings/', MeetingsView.as_view(), name='meetings'),
    path('meetings/<int:id>', MeetingsView.as_view(), name='meetings_with_id'),
]
