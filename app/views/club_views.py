from django.http import QueryDict

from app.models import Club, User
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from app.serializers import ClubSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q


class Clubs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clubs = Club.objects.filter(visibility=True)
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if type(request.data) == QueryDict:
            partial_club = request.data.dict()
        else:
            partial_club = request.data
        partial_club['owner'] = request.user.id
        serializer = ClubSerializer(data=partial_club)
        if serializer.is_valid():
            new_club = serializer.save()
            if new_club:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserClubView(APIView):
    """API view of all clubs a user is in"""
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            clubs = Club.objects.filter(Q(owner=user) | Q(admins=user) | Q(members=user)).distinct().values()
            return Response({'clubs': clubs}, status=status.HTTP_200_OK)
        except:
            return Response(data='User is invalid', status=status.HTTP_400_BAD_REQUEST)

class SingleClub(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            club = Club.objects.get(pk=kwargs['id'])
            serializer = ClubSerializer(club)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Club.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, club):
        serializer = ClubSerializer(club, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        if 'action' not in kwargs:
            return Response(data='You need to provide an action', status=status.HTTP_400_BAD_REQUEST)
        action = kwargs['action']
        try:
            club = Club.objects.get(pk=kwargs['id'])

            if action == 'update':
                return self.update(request, club)

            user = User.objects.get(pk=kwargs['user_id'])

            if user:
                club.remove_user_from_club(user)
                if action == 'accept':
                    club.add_member(user) #.members.add(user) 
                    return self.update(request, club)

                elif action == 'remove':
                    club.remove_member(user)
                    return self.update(request, club)

                elif action == 'reject':
                    club.remove_applicant(user)
                    return self.update(request, club)

                elif action == 'ban':
                    club.add_banned_user(user)
                    return self.update(request, club)

                elif action == 'unban':
                    club.remove_banned_user(user)
                    return self.update(request, club)

                elif action == 'apply':
                    club.add_applicant(user)
                    return self.update(request, club)

                elif action == 'transfer':
                    club.transfer_ownership(user)
                    return self.update(request, club)

                else:
                    return Response(data='Invalid action', status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response(data='Invalid action', status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response(data='Invalid parameters', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            club = Club.objects.get(pk=kwargs['id'])
            club.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Club.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
