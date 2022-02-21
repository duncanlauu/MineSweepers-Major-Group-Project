from re import U
from app.forms import PasswordForm, SignUpForm
from app.models import Club, User
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.generic.edit import FormView
from ..serializers import RegisterUserSerializer, ClubSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .mixins import LoginProhibitedMixin
from rest_framework.views import APIView

# View modified from Clucker


class PasswordView(LoginRequiredMixin, FormView):
    """View that handles password change requests."""

    template_name = 'password.html'
    form_class = PasswordForm

    def get_form_kwargs(self, **kwargs):
        """Pass the current user to the password change form."""

        kwargs = super().get_form_kwargs(**kwargs)
        kwargs.update({'user': self.request.user})
        return kwargs

    def form_valid(self, form):
        """Handle valid form by saving the new password."""

        form.save()
        login(self.request, self.request.user)
        return super().form_valid(form)

    def get_success_url(self):
        """Redirect the user after successful password change."""

        messages.add_message(
            self.request, messages.SUCCESS, "Password updated!")
        return reverse('dummy')


# View modified from Clucker
class SignUpView(LoginProhibitedMixin, FormView):
    """View that signs up user."""

    form_class = SignUpForm
    template_name = "sign_up.html"
    redirect_when_logged_in_url = settings.REDIRECT_URL_WHEN_LOGGED_IN

    def form_valid(self, form):
        self.object = form.save()
        login(self.request, self.object)
        return super().form_valid(form)

    def get_success_url(self):
        return reverse(settings.REDIRECT_URL_WHEN_LOGGED_IN)


# from https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3

class CreateUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            newuser = reg_serializer.save()
            if newuser:
                return Response(status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST) # need to send back more information when something goes wrong. Data missing? Email/ username already in use?


    def get(self, request, format=None):
            try:
                user = User.objects.get(pk=request.query_params['id'])
                
                if request.query_params['field'] == "clubs":
                    try:
                        serializer = ClubSerializer(user.clubs.all(), many=True)
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    except Club.DoesNotExist:
                        return Response(status=status.HTTP_404_NOT_FOUND)

                serializer = RegisterUserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, format=None):
        user = User.objects.get(pk=request.query_params['id'])
        serializer = RegisterUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class Users(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = RegisterUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)