from django.conf import settings
from django.views.generic.edit import FormView
from django.contrib.auth import login
from .mixins import LoginProhibitedMixin
from app.forms import SignUpForm
from .mixins import LoginProhibitedMixin

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
