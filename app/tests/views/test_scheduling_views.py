from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from app.models import Meeting, User, VotingPeriod, BookVote, TimeVote
from app.serializers import MeetingSerializer


class SchedulingTestCase(APITestCase):
    """Tests of the scheduling API"""

    fixtures = [
        'app/tests/fixtures/default_user.json',
        'app/tests/fixtures/other_users.json',
        'app/tests/fixtures/default_book.json',
        'app/tests/fixtures/other_books.json',
        'app/tests/fixtures/default_club.json',
        'app/tests/fixtures/default_voting_period.json',
        'app/tests/fixtures/default_book_vote.json',
        'app/tests/fixtures/default_time_vote.json',
        'app/tests/fixtures/default_time_period.json',
        'app/tests/fixtures/other_time_periods.json',
        'app/tests/fixtures/other_book_votes.json',
        'app/tests/fixtures/other_time_votes.json',
        'app/tests/fixtures/default_meeting.json',
        'app/tests/fixtures/other_clubs.json',
    ]

    def setUp(self):
        self.meeting = Meeting.objects.get(pk=1)
        self.user = User.objects.get(id=1)
        self.client.force_authenticate(user=self.user)

    def test_get_meeting(self):
        response = self.client.get(reverse('app:scheduling_with_id', kwargs={'id': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, MeetingSerializer(self.meeting).data)

    def test_meeting_with_invalid_id(self):
        response = self.client.get(reverse('app:scheduling_with_id', kwargs={'id': 2}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, 'A meeting with this id does not exist')

    def test_meeting_with_no_id(self):
        response = self.client.get(reverse('app:scheduling'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You need to provide the meeting id')

    def test_post_with_only_necessary_information(self):
        number_of_meetings_before = Meeting.objects.count()
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        number_of_meetings_after = Meeting.objects.count()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(number_of_meetings_after, number_of_meetings_before + 1)
        try:
            voting_period = VotingPeriod.objects.get(meeting=response.data['id'])
            self.assertEqual(voting_period.time_period.id, 1)
            self.assertEqual(set(book.pk for book in voting_period.proposed_books.all()), {"0195153448", "0380715899"})
            self.assertEqual(set(time.pk for time in voting_period.proposed_times.all()), {2, 3, 4})
        except VotingPeriod.DoesNotExist:
            self.fail('The related voting period should exist')

        self.assertEqual(response.data['name'], 'This is a second meeting')
        self.assertEqual(response.data['description'], 'We will establish the book reading practices')
        self.assertEqual(response.data['club'], 1)
        self.assertEqual(response.data['organiser'], 1)
        self.assertEqual(response.data['attendees'], [2, 3, 4, 5])

    def test_post_with_all_information(self):
        number_of_meetings_before = Meeting.objects.count()
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'book': "0195153448",
            'start_time': '2022-03-12T18:00:00+00:00',
            'end_time': '2022-03-12T19:00:00+00:00',
            'link': 'This is the meeting link'
        })
        number_of_meetings_after = Meeting.objects.count()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(number_of_meetings_after, number_of_meetings_before + 1)
        self.assertEqual(response.data['name'], 'This is a second meeting')
        self.assertEqual(response.data['description'], 'We will establish the book reading practices')
        self.assertEqual(response.data['club'], 1)
        self.assertEqual(response.data['organiser'], 1)
        self.assertEqual(response.data['attendees'], [2, 3, 4, 5])
        self.assertEqual(response.data['book']['ISBN'], "0195153448")
        self.assertEqual(response.data['link'], 'This is the meeting link')

    def test_post_with_incomplete_information(self):
        number_of_meetings_before = Meeting.objects.count()
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        number_of_meetings_after = Meeting.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You need to provide all necessary arguments')
        self.assertEqual(number_of_meetings_after, number_of_meetings_before)

    def test_post_with_empty_name(self):
        number_of_meetings_before = Meeting.objects.count()
        response = self.client.post(reverse('app:scheduling'), data={
            'name': '',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        number_of_meetings_after = Meeting.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['name'][0], 'This field may not be blank.')
        self.assertEqual(number_of_meetings_after, number_of_meetings_before)

    def test_post_with_empty_name_with_book(self):
        number_of_meetings_before = Meeting.objects.count()
        response = self.client.post(reverse('app:scheduling'), data={
            'name': '',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'book': "0195153448",
            'start_time': '2022-03-12T18:00:00+00:00',
            'end_time': '2022-03-12T19:00:00+00:00',
            'link': 'This is the meeting link'
        })
        number_of_meetings_after = Meeting.objects.count()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['name'][0], 'This field may not be blank.')
        self.assertEqual(number_of_meetings_after, number_of_meetings_before)

    def test_put_to_make_a_book_vote(self):
        # First we do a post with the necessary information
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        meeting_id = response.data['id']
        number_of_votes_before = BookVote.objects.count()
        response = self.client.put(reverse('app:scheduling'), data={
            'action': 'book_vote',
            'id': meeting_id,
            'user': 2,
            'book': "0380715899"
        })
        number_of_votes_after = BookVote.objects.count()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, 'Book vote recorded')
        self.assertEqual(number_of_votes_after, number_of_votes_before + 1)
        voting_period = VotingPeriod.objects.get(meeting=meeting_id)
        vote = voting_period.book_votes.get(user=2, book="0380715899")
        self.assertEqual(vote.user_id, 2)
        self.assertEqual(vote.book_id, "0380715899")

    def test_put_to_make_a_time_vote(self):
        # First we do a post with the necessary information
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        meeting_id = response.data['id']
        number_of_votes_before = TimeVote.objects.count()
        response = self.client.put(reverse('app:scheduling'), data={
            'action': 'time_vote',
            'id': meeting_id,
            'user': 2,
            'time': 2
        })
        number_of_votes_after = TimeVote.objects.count()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, 'Time vote recorded')
        self.assertEqual(number_of_votes_after, number_of_votes_before + 1)
        voting_period = VotingPeriod.objects.get(meeting=meeting_id)
        vote = voting_period.time_votes.get(user=2, time_period=2)
        self.assertEqual(vote.user_id, 2)
        self.assertEqual(vote.time_period_id, 2)

    def test_put_to_fill_in_the_meeting(self):
        # First we do a post with the necessary information
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        meeting_id = response.data['id']
        # Then make some votes for books
        self.client.put(reverse('app:scheduling'), data={
            'action': 'book_vote',
            'id': meeting_id,
            'user': 2,
            'book': "0380715899"
        })
        self.client.put(reverse('app:scheduling'), data={
            'action': 'book_vote',
            'id': meeting_id,
            'user': 2,
            'book': "0195153448"
        })
        self.client.put(reverse('app:scheduling'), data={
            'action': 'book_vote',
            'id': meeting_id,
            'user': 1,
            'book': "0195153448"
        })
        # now make some votes for time
        self.client.put(reverse('app:scheduling'), data={
            'action': 'time_vote',
            'id': meeting_id,
            'user': 1,
            'time': 3
        })
        self.client.put(reverse('app:scheduling'), data={
            'action': 'time_vote',
            'id': meeting_id,
            'user': 1,
            'time': 2
        })
        self.client.put(reverse('app:scheduling'), data={
            'action': 'time_vote',
            'id': meeting_id,
            'user': 2,
            'time': 2
        })
        # Now we can fill in the meeting
        response = self.client.put(reverse('app:scheduling'), data={
            'action': 'fill_in_meeting',
            'id': meeting_id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        meeting = Meeting.objects.get(pk=meeting_id)
        self.assertEqual(response.data, MeetingSerializer(meeting).data)
        self.assertEqual(meeting.book_id, "0195153448")
        self.assertEqual(meeting.time_id, 2)
        self.assertEqual(meeting.link,
                         'We found that using Zoom or Microsoft Teams is expensive. This link is a fake link (but for free)')

    def test_put_with_wrong_action(self):
        response = self.client.put(reverse('app:scheduling'), data={
            'action': 'wrong_action'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You need to provide a correct action')

    def test_put_with_no_action(self):
        response = self.client.put(reverse('app:scheduling'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You need to provide correct parameters')

    def test_put_with_incorrect_parameters(self):
        response = self.client.put(reverse('app:scheduling'), data={
            'action': 'time_vote',
            'user': 2,
            'time': 2
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You need to provide correct parameters')

    def test_get_with_incorrect_permissions(self):
        user = User.objects.get(pk=5)
        self.client.force_authenticate(user)
        response = self.client.get(reverse('app:scheduling_with_id', kwargs={'id': 1}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, 'The user needs to be a member of the club')

    def test_post_with_incorrect_permissions(self):
        user = User.objects.get(pk=5)
        self.client.force_authenticate(user)
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, 'The user needs to be the organiser of the meeting')

    def test_put_book_vote_with_incorrect_permissions(self):
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        meeting_id = response.data['id']
        user = User.objects.get(pk=5)
        self.client.force_authenticate(user)
        response = self.client.put(reverse('app:scheduling'), data={
            'action': 'book_vote',
            'id': meeting_id,
            'user': 2,
            'book': "0380715899"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, 'The user needs to be a member of the club')

    def test_put_time_vote_with_incorrect_permissions(self):
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        meeting_id = response.data['id']
        user = User.objects.get(pk=5)
        self.client.force_authenticate(user)
        response = self.client.put(reverse('app:scheduling'), data={
            'action': 'time_vote',
            'id': meeting_id,
            'user': 2,
            'time': 2
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, 'The user needs to be a member of the club')

    def test_put_fill_in_meeting_with_incorrect_permissions(self):
        response = self.client.post(reverse('app:scheduling'), data={
            'name': 'This is a second meeting',
            'description': 'We will establish the book reading practices',
            'club': 1,
            'organiser': 1,
            'attendees': [2, 3, 4, 5],
            'voting_period': 1,
            'proposed_books': ["0195153448", "0380715899"],
            'proposed_times': [2, 3, 4]
        })
        meeting_id = response.data['id']
        user = User.objects.get(pk=5)
        self.client.force_authenticate(user)
        response = self.client.put(reverse('app:scheduling'), data={
            'action': 'fill_in_meeting',
            'id': meeting_id
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, 'The user needs to be the organiser of the meeting')


class CalendarTestCase(APITestCase):
    """Tests of the calendar API"""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/default_time_period.json',
                'app/tests/fixtures/default_meeting.json',
                'app/tests/fixtures/other_clubs.json']

    def setUp(self):
        self.meeting = Meeting.objects.get(pk=1)
        self.user = User.objects.get(id=1)
        self.client.force_authenticate(user=self.user)

    def test_get_calendar(self):
        response = self.client.get(reverse('app:calendar_with_id', kwargs={'id': 1}))
        self.assertEqual(response.data, b'BEGIN:VCALENDAR\r\nVERSION:1.0\r\nPRODID:-//Book club '
                                        b'event//bookgle.com//\r\nBEGIN:VEVENT\r\nSUMMARY:Meeting number '
                                        b'1\r\nDTSTART;VALUE=DATE-TIME:20220312T170000Z\r\nDTEND;VALUE=DATE-TIME'
                                        b':20220312T180000Z\r\nDTSTAMP;VALUE=DATE:20220312\r\nLOCATION:This is a fake '
                                        b'link\r\nORGANIZER;CN=johndoe:MAILTO:johndoe@example.org\r\nURL:This is a '
                                        b'fake link\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_calendar_with_invalid_id(self):
        response = self.client.get(reverse('app:calendar_with_id', kwargs={'id': 2}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, 'A meeting with this id does not exist')

    def test_get_calendar_with_no_id(self):
        response = self.client.get(reverse('app:calendar'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You need to provide the meeting id')

    def test_get_calendar_with_invalid_user(self):
        user = User.objects.get(id=5)
        self.client.force_authenticate(user=user)
        response = self.client.get(reverse('app:calendar_with_id', kwargs={'id': 1}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, 'The user needs to be a member of the club')


class MeetingsTestCase(APITestCase):
    """Tests of the meetings API"""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/other_clubs.json',
                'app/tests/fixtures/default_time_period.json',
                'app/tests/fixtures/other_time_periods.json',
                'app/tests/fixtures/default_meeting.json',
                'app/tests/fixtures/other_meetings.json']

    def setUp(self):
        self.meeting = Meeting.objects.get(pk=1)
        self.user = User.objects.get(id=1)
        self.client.force_authenticate(user=self.user)

    def test_get_meetings_for_mostly_organiser(self):
        response = self.client.get(reverse('app:meetings_with_id', kwargs={'id': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = MeetingSerializer(list(Meeting.objects.filter(id__in=[1, 2, 3, 4])), many=True)
        sorted_meetings = sorted(response.data, key=lambda k: k['id'])
        self.assertEqual(serializer.data, sorted_meetings)

    def test_get_meetings_with_invalid_id(self):
        response = self.client.get(reverse('app:meetings_with_id', kwargs={'id': 2}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, 'You can only see your own meetings')

    def test_get_meetings_for_mostly_attendee(self):
        self.client.force_authenticate(user=User.objects.get(pk=2))
        response = self.client.get(reverse('app:meetings_with_id', kwargs={'id': 2}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = MeetingSerializer(list(Meeting.objects.filter(id__in=[1, 2, 3, 4])), many=True)
        sorted_meetings = sorted(response.data, key=lambda k: k['id'])
        self.assertEqual(serializer.data, sorted_meetings)

    def test_get_meetings_for_attendee(self):
        self.client.force_authenticate(user=User.objects.get(pk=3))
        response = self.client.get(reverse('app:meetings_with_id', kwargs={'id': 3}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = MeetingSerializer(list(Meeting.objects.filter(id__in=[1, 2, 3])), many=True)
        sorted_meetings = sorted(response.data, key=lambda k: k['id'])
        self.assertEqual(serializer.data, sorted_meetings)

    def test_get_meetings_for_sporadic_attendee(self):
        self.client.force_authenticate(user=User.objects.get(pk=4))
        response = self.client.get(reverse('app:meetings_with_id', kwargs={'id': 4}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = MeetingSerializer(list(Meeting.objects.filter(id__in=[1, 3])), many=True)
        sorted_meetings = sorted(response.data, key=lambda k: k['id'])
        self.assertEqual(serializer.data, sorted_meetings)

    def test_get_meetings_with_user_that_has_no_meetings(self):
        self.client.force_authenticate(user=User.objects.get(pk=5))
        response = self.client.get(reverse('app:meetings_with_id', kwargs={'id': 5}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_meetings_with_no_id(self):
        response = self.client.get(reverse('app:meetings'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You need to provide the user id')


class ClubMeetingsTestCase(APITestCase):
    """Tests of the club meetings API"""

    fixtures = ['app/tests/fixtures/default_user.json',
                'app/tests/fixtures/other_users.json',
                'app/tests/fixtures/default_book.json',
                'app/tests/fixtures/other_books.json',
                'app/tests/fixtures/default_club.json',
                'app/tests/fixtures/other_clubs.json',
                'app/tests/fixtures/default_time_period.json',
                'app/tests/fixtures/other_time_periods.json',
                'app/tests/fixtures/default_meeting.json',
                'app/tests/fixtures/other_meetings.json']

    def setUp(self):
        self.meeting = Meeting.objects.get(pk=1)
        self.user = User.objects.get(id=1)
        self.client.force_authenticate(user=self.user)

    def test_get_meetings_for_the_default_club(self):
        response = self.client.get(reverse('app:club_meetings_with_id', kwargs={'id': 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = MeetingSerializer(list(Meeting.objects.filter(id__in=[1, 2, 3, 4])), many=True)
        self.assertEqual(serializer.data, response.data)

    def test_get_meetings_for_the_other_club(self):
        response = self.client.get(reverse('app:club_meetings_with_id', kwargs={'id': 2}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_meetings_with_invalid_id(self):
        response = self.client.get(reverse('app:club_meetings_with_id', kwargs={'id': 20}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'A club with this id does not exist')

    def test_get_meetings_with_no_id(self):
        response = self.client.get(reverse('app:club_meetings'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You need to provide the club id')
