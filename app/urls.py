from django.urls import path
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView
from django.contrib.auth import views as auth_views

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    # path('password_reset/', auth_views.PasswordResetView.as_view(html_email_template_name='password_reset_templates/password_reset_html_email.html'), name="password_reset")
]
