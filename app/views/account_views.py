from app.models import User
from ..serializers import RegisterUserSerializer
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


# from https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3
class CreateUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reg_serializer = RegisterUserSerializer(data=request.data)
        if reg_serializer.is_valid():
            newuser = reg_serializer.save()
            if newuser:
                return Response(status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)  # need to send back more information when something goes wrong. Data missing? Email/ username already in use?

    def get(self, request, *args, **kwargs):
        try:
            user = User.objects.get(pk=kwargs['id'])
            serializer = RegisterUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        user = User.objects.get(pk=kwargs['id'])
        serializer = RegisterUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        # need to send back more information when something goes wrong. Data missing? Email/ username already in use?
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
