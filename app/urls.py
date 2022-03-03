from django.urls import path, include
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView, GetCurrentUserView
from .views.recommender_views import RecommenderAPI
from .views.static_views import HelloWorldView
from .views.authentication_views import BlacklistTokenView
from django.contrib.auth import views as auth_views

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
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
]
