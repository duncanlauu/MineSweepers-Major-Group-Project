from app.models import Club, User, Chat
from app.helpers import remove_user_from_club, user_in_club, user_is_banned
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from app.serializers import ClubSerializer
from rest_framework.permissions import IsAuthenticated


class Clubs(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        clubs = Club.objects.filter(visibility=True)
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        partial_club = request.data
        partial_club['owner'] = request.user.id
        serializer = ClubSerializer(data=partial_club)
        if serializer.is_valid():
            new_club = serializer.save()
            if new_club:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SingleClub(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        club = Club.objects.get(pk=kwargs['id'])
        serializer = ClubSerializer(club)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def update(self, request, club):
        serializer = ClubSerializer(club, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        if 'action' not in kwargs:
            return Response(data='You need to provide an action', status=status.HTTP_404_NOT_FOUND)
        action = kwargs['action']
        club = Club.objects.get(pk=kwargs['id'])

        user = User.objects.get(pk=kwargs['user_id'])
        
        if user:
            club.remove_user_from_club(user)
            if action == 'accept':
                club.members.add(user)
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
                return Response(data='Invalid action', status=status.HTTP_404_NOT_FOUND)
                
        elif action == 'update':
            return self.update(request, club)

        else:
            return Response(data='Invalid action', status=status.HTTP_404_NOT_FOUND)
                
       

    def delete(self, request, *args, **kwargs):
        club = Club.objects.get(pk=kwargs['id'])
        club.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

