from django.urls import path, include
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView, GetCurrentUserView
from .views.static_views import HelloWorldView
from .views.authentication_views import BlacklistTokenView
from django.contrib.auth import views as auth_views
from .views.club_views import Clubs, SingleClub

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),

    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    path('get_current_user/', GetCurrentUserView.as_view(), name='current_user'),
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    # Reset User Password
    path('auth/', include('djoser.urls')),

    #Club API
    path('user/get_update/<int:id>/', CreateUser.as_view(), name="get_update"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    path('clubs/', Clubs.as_view(), name='clubs'),
    path('singleclub/<int:id>/', SingleClub.as_view(), name='retrieve_single_club'),
    path('singleclub/<int:id>/<str:action>/<int:user_id>', SingleClub.as_view(), name='manage_club'),
    path('singleclub/<int:id>/<str:action>/', SingleClub.as_view(), name='update_club')






]
