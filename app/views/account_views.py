from django.conf import settings
from django.contrib import messages
from django.views.generic.edit import FormView
from django.contrib.auth import login
from .mixins import LoginProhibitedMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from app.forms import SignUpForm, PasswordForm, EditProfileForm
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render



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

        messages.add_message(self.request, messages.SUCCESS, "Password updated!")
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


#Edit User profile
@login_required 
def edit_profile(request):
    form = EditProfileForm(request.POST, instance=request.user)
    if form.is_valid():
            form.save()
            return redirect('dummy')
    else:
        messages.add_message(request, messages.ERROR, "Invalid Information")
        form = EditProfileForm(instance=request.user)
    return render(request,'edit_profile.html', {'form': form})
