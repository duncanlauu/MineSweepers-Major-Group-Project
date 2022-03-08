from ..serializers import RegisterUserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


# from https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3
class CreateUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            newuser = reg_serializer.save()
            if newuser:
                return Response(status=status.HTTP_201_CREATED)
        # need to send back more information when something goes wrong. Data missing? Email/ username already in use?
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
