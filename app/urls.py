from django.urls import path
from .views.account_views import CreateUser

app_name = 'app'

urlpatterns = [
    path('register/', CreateUser.as_view(), name="create_user"),
]
