"""Forms for the app."""
from django import forms
from django.contrib.auth import authenticate
from django.core.validators import RegexValidator
from .models import User, Club

# Mixin modified from Clucker
class NewPasswordMixin(forms.Form):
    """Form mixing for new_password and password_confirmation fields."""

    new_password = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(),
        validators=[RegexValidator(
            regex=r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$',
            message='Password must contain an uppercase character, a lowercase '
                    'character and a number'
            )]
    )
    password_confirmation = forms.CharField(label='Password confirmation', widget=forms.PasswordInput())

    def clean(self):
        """Form mixing for new_password and password_confirmation fields."""

        super().clean()
        new_password = self.cleaned_data.get('new_password')
        password_confirmation = self.cleaned_data.get('password_confirmation')
        if new_password != password_confirmation:
            self.add_error('password_confirmation', 'Confirmation does not match password.')

# Form modified from Clucker
class LogInForm(forms.Form):
    """Form enabling registered users to log in."""

    username = forms.CharField(label="Username")
    password = forms.CharField(label="Password", widget=forms.PasswordInput())

    def get_user(self):
        """Returns authenticated user if possible."""

        user = None
        if self.is_valid():
            username = self.cleaned_data.get('username')
            password = self.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
        return user

# Form modified from Clucker
class SignUpForm(NewPasswordMixin, forms.ModelForm):
    """Form enabling unregistered users to sign up."""

    class Meta:
        """Form options."""

        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'bio', 'location', 'birthday']
        widgets = { 'bio': forms.Textarea() }

    def save(self):
        """Create a new user."""

        super().save(commit=False)
        user = User.objects.create_user(
            self.cleaned_data.get('username'),
            password=self.cleaned_data.get('new_password'),
            email=self.cleaned_data.get('email'),
            first_name=self.cleaned_data.get('first_name'),
            last_name=self.cleaned_data.get('last_name'),
            bio=self.cleaned_data.get('bio'),
            location=self.cleaned_data.get('location'),
            birthday=self.cleaned_data.get('birthday')
        )
        return user


# Create Club form

class CreateClubForm(forms.ModelForm):
    """Form enabling users to create a club."""

    class Meta:
        """Form options."""

        model = Club
        fields = ['name', 'description', 'visibility', 'public']
        widgets = { 'description': forms.Textarea() }

    def save(self,user):
        """Create a new club."""

        super().save(commit=False)
        club = Club.objects.create(
            name = self.cleaned_data.get('name'),
            description = self.cleaned_data.get('description'),
            owner = user,
            visibility = self.cleaned_data.get('visibility'),
            public = self.cleaned_data.get('public')        
        )
        return club
