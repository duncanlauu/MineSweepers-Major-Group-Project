from django.http import QueryDict
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from icalendar import Calendar, Event, vCalAddress, vText

from app.models import Meeting, VotingPeriod, TimePeriod, BookVote, TimeVote, User, \
    get_all_users_related_to_a_club
from app.serializers import MeetingSerializer


class SchedulingView(APIView):
    """This class is responsible for handling all requests for scheduling"""

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if 'id' not in kwargs:
            return Response(data='You need to provide the meeting id', status=status.HTTP_400_BAD_REQUEST)
        try:
            meeting = Meeting.objects.get(pk=kwargs['id'])
            # Make sure the user is a part of the related club
            if User.objects.get(username=request.user) not in get_all_users_related_to_a_club(meeting.club):
                return Response(data='The user needs to be a member of the club',
                                status=status.HTTP_401_UNAUTHORIZED)
            serializer = MeetingSerializer(meeting)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            return Response(data='A meeting with this id does not exist', status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            data = {'name': request.data['name'], 'description': request.data['description'],
                    'club': request.data['club'], 'organiser': request.data['organiser'],
                    'attendees': (request.data.getlist('attendees') if isinstance(request.data, QueryDict)
                                  else request.data['attendees'])}
            # Make sure the user is the organiser of the meeting
            if User.objects.get(username=request.user).id != int(request.data['organiser']):
                return Response(data='The user needs to be the organiser of the meeting',
                                status=status.HTTP_401_UNAUTHORIZED)
            serializer = MeetingSerializer(data=data)
            if serializer.is_valid():
                new_meeting = serializer.save()
                if new_meeting:
                    if 'book' not in request.data:
                        voting_period = VotingPeriod.objects.create(
                            time_period_id=request.data['voting_period'],
                            meeting=new_meeting
                        )
                        voting_period.proposed_books.set(
                            (request.data.getlist('proposed_books') if isinstance(request.data, QueryDict)
                             else request.data['proposed_books']))
                        voting_period.proposed_times.set(
                            (request.data.getlist('proposed_times') if isinstance(request.data, QueryDict)
                             else request.data['proposed_times']))
                        voting_period.save()
                    else:
                        new_meeting.book_id = request.data['book']
                        time = TimePeriod.objects.create(
                            start_time=request.data['start_time'],
                            end_time=request.data['end_time']
                        )
                        new_meeting.time_id = time.pk
                        new_meeting.link = request.data['link']
                        new_meeting.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response('You need to provide all necessary arguments', status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        try:
            if request.data['action'] == 'fill_in_meeting':
                voting_period = VotingPeriod.objects.get(meeting=request.data['id'])
                # Make sure the user is the organiser of the meeting
                if User.objects.get(username=request.user).id != voting_period.meeting.organiser_id:
                    return Response(data='The user needs to be the organiser of the meeting',
                                    status=status.HTTP_401_UNAUTHORIZED)
                voting_period.fill_in_the_meeting()
                updated_meeting = voting_period.meeting
                serializer = MeetingSerializer(updated_meeting)
                return Response(serializer.data, status.HTTP_201_CREATED)
            if request.data['action'] == 'book_vote':
                voting_period = VotingPeriod.objects.get(meeting=request.data['id'])
                # Make sure the user is a part of the related club
                if User.objects.get(username=request.user) not in get_all_users_related_to_a_club(
                        voting_period.meeting.club):
                    return Response(data='The user needs to be a member of the club',
                                    status=status.HTTP_401_UNAUTHORIZED)
                book_vote = BookVote.objects.create(
                    user_id=request.data['user'],
                    book_id=request.data['book']
                )
                voting_period.book_votes.add(book_vote)
                voting_period.save()
                return Response(data='Book vote recorded', status=status.HTTP_200_OK)
            if request.data['action'] == 'time_vote':
                voting_period = VotingPeriod.objects.get(meeting=request.data['id'])
                # Make sure the user is a part of the related club
                if User.objects.get(username=request.user) not in get_all_users_related_to_a_club(
                        voting_period.meeting.club):
                    return Response(data='The user needs to be a member of the club',
                                    status=status.HTTP_401_UNAUTHORIZED)
                time_vote = TimeVote.objects.create(
                    user_id=request.data['user'],
                    time_period_id=request.data['time']
                )
                voting_period.time_votes.add(time_vote)
                voting_period.save()
                return Response(data='Time vote recorded', status=status.HTTP_200_OK)
            return Response(data='You need to provide a correct action', status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response(data='You need to provide correct parameters', status=status.HTTP_400_BAD_REQUEST)


class CalendarView(APIView):
    def get(self, request, *args, **kwargs):
        if 'id' not in kwargs:
            return Response(data='You need to provide the meeting id', status=status.HTTP_400_BAD_REQUEST)
        try:
            meeting = Meeting.objects.get(pk=kwargs['id'])
            user = User.objects.get(username=request.user)
            # Make sure the user is a part of the related club
            if user not in get_all_users_related_to_a_club(meeting.club):
                return Response(data='The user needs to be a member of the club',
                                status=status.HTTP_401_UNAUTHORIZED)
            calendar = Calendar()
            calendar.add('prodid', '-//Book club event//bookgle.com//')
            calendar.add('version', '1.0')
            event = Event()
            event.add('summary', meeting.name)
            event.add('dtstart', meeting.time.start_time)
            event.add('dtend', meeting.time.end_time)
            event.add('dtstamp', meeting.time.start_time.date())
            organiser = vCalAddress(f'MAILTO:{meeting.organiser.email}')
            organiser.params['cn'] = vText(meeting.organiser.username)
            event.add('organizer', organiser)
            event['location'] = vText(meeting.link)
            event.add('url', meeting.link)
            calendar.add_component(event)
            return Response(data=calendar.to_ical(), status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            return Response(data='A meeting with this id does not exist', status=status.HTTP_404_NOT_FOUND)
