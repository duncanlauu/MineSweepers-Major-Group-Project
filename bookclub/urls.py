"""bookclub URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from app import views
from app.views.recommender_views import RecommenderAPI
from frontend import frontend_views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # General URLs
    path('admin/', admin.site.urls),
    # path('', views.home, name='home'),
    path('', include('frontend.urls')),

    # path('sign_up/', views.SignUpView.as_view(), name='sign_up'),
    # path('log_in/', views.LogInView.as_view(), name='log_in'),
    # path('log_out/', views.log_out, name='log_out'),
    path('password/', views.PasswordView.as_view(), name='password'),
    path('dummy/', views.dummy, name='dummy'),
    # path('', views.dummy, name='dummy'),

    # Reset User Password
    path("password_reset/",
         auth_views.PasswordResetView.as_view(template_name="password_reset_templates/password_reset.html",
                                              html_email_template_name='password_reset_templates/password_reset_html_email.html'),
         name="password_reset"),
    path("password_reset/done/", auth_views.PasswordResetDoneView.as_view(
        template_name="password_reset_templates/password_reset_done.html"), name="password_reset_done"),
    path("password_reset_confirm/<uidb64>/<token>", auth_views.PasswordResetConfirmView.as_view(
        template_name="password_reset_templates/password_reset_confirm.html"), name="password_reset_confirm"),
    path("password_reset_complete/", auth_views.PasswordResetCompleteView.as_view(
        template_name="password_reset_templates/password_reset_complete.html"), name="password_reset_complete"),

    # Clubs URL
    path('create_club/', views.create_club, name='create_club'),
    path('club_list/', views.club_list, name='club_list'),
    path('user_club_list/', views.user_club_list, name='user_club_list'),

    path('apply_club/<int:club_id>', views.apply_club, name='apply_club'),
    path('accept_applicant/<int:club_id>/<int:applicant_id>', views.accept_applicant, name='accept_applicant'),
    path('reject_applicant/<int:club_id>/<int:applicant_id>', views.reject_applicant, name='reject_applicant'),
    path('ban_member/<int:club_id>/<int:member_id>', views.ban_member, name='ban_member'),
    path('transfer_ownership/<int:club_id>/<int:new_owner_id>', views.transfer_ownership, name='transfer_ownership'),

    # Messaging
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),

    # Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('app.urls', namespace='app')),
    # endpoint for the registration. This is where the API (React) will point.

    # Recommender system
    path('recommender/', RecommenderAPI.as_view(), name='recommender'),
    path('recommender/<str:action>', RecommenderAPI.as_view(), name='recommender_action'),
    path('recommender/<int:n>/<int:id>/<str:action>', RecommenderAPI.as_view(), name='recommender_top_n'),
    path('recommender/<int:n>/<int:id>/<str:action>/<str:genre>', RecommenderAPI.as_view(),
         name='recommender_top_n_for_genre'),
    path('recommender/<int:n>/<str:action>', RecommenderAPI.as_view(), name='recommender_top_n_global'),
    path('recommender/<int:n>/<str:action>/<str:genre>', RecommenderAPI.as_view(),
         name='recommender_top_n_global_for_genre'),

    # create seperate app for api communication for data?
]
