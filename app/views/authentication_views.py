"""Authentication related views."""
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

class BlacklistTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)



# View modified from Clucker

# Login is now handled through access tokens. This is not needed anymore.

# class LogInView(LoginProhibitedMixin, View):
#     """View that handles log in."""

#     http_method_names = ['get', 'post']
#     redirect_when_logged_in_url = 'dummy' #Change later

#     def get(self, request):
#         """Display log in template."""

#         self.next = request.GET.get('next') or ''
#         return self.render()

#     def post(self, request):
#         """Handle log in attempt."""

#         form = LogInForm(request.POST)
#         self.next = request.POST.get('next') or settings.REDIRECT_URL_WHEN_LOGGED_IN
#         user = form.get_user()
#         if user is not None:
#             login(request, user)
#             return redirect(self.next)
#         messages.add_message(request, messages.ERROR, "The credentials provided were invalid!")
#         return self.render()

#     def render(self):
#         """Render log in template with blank log in form."""

#         form = LogInForm()
#         return render(self.request, 'log_in.html', {'form': form, 'next': self.next})



# def log_out(request):
#     logout(request)
#     return redirect('home')
