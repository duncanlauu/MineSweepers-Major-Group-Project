import datetime
from operator import itemgetter

from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager as AbstractUserManager
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
from django.db.models import Q


# It uses datetime.date which only uses the date
def PastDateValidator(date):
    if date > datetime.date.today():
        raise ValidationError("Date cannot be in the future")


# It uses datetime.datetime which includes hours too
def FutureDateValidator(date):
    if date < timezone.now():
        raise ValidationError("Date cannot be in the past")


#User Manager class
class UserManager(AbstractUserManager):
    def search(self, query=None):
        qs = self.get_queryset()
        if query is not None:
            or_lookup = (Q(username__icontains=query) |
                         Q(first_name__icontains=query) |
                         Q(last_name__icontains=query) |
                         Q(email__icontains=query)
                        )
            qs = qs.filter(or_lookup).distinct()
        return qs


# User class
class User(AbstractUser):
    username = models.CharField(
        max_length=50,
        unique=True,
        validators=[RegexValidator(
            regex=r'^\w{3,}',
            message='Username must consist of at least three alphanumericals'
        )]
    )
    email = models.EmailField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50, blank=False)
    last_name = models.CharField(max_length=50, blank=False)
    bio = models.CharField(max_length=500, blank=True)
    location = models.CharField(max_length=70, blank=True)
    birthday = models.DateField(validators=[PastDateValidator], blank=False, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # ? not sure how to test this
    liked_books = models.ManyToManyField('Book', related_name='liked_books',
                                         blank=True)  # blank true for development purposes.
    read_books = models.ManyToManyField('Book', related_name='read_books',
                                        blank=True)  # blank true for development purposes.
    clubs = models.ManyToManyField('Club', related_name='clubs', blank=True)
    friends = models.ManyToManyField("User", blank=True)

    objects= UserManager()

    def add_liked_book(self, book):
        self.liked_books.add(book)

    def liked_books_count(self):
        return self.liked_books.count()

    def remove_liked_book(self, book):
        self.liked_books.remove(book)

    def add_read_book(self, book):
        self.read_books.add(book)

    def read_books_count(self):
        return self.read_books.count()

    def remove_read_book(self, book):
        self.read_books.remove(book)

    def add_club(self, club):
        self.clubs.add(club)

    def remove_club(self, club):
        self.clubs.remove(club)

    def add_friend(self, user):
        self.friends.add(user)

    def remove_friend(self, user):
        self.friends.remove(user)

    def send_friend_request(self, other_user):
        request_exists = FriendRequest.objects.filter(
            sender=self, receiver=other_user).exists()
        is_friend = other_user in self.friends.all()
        if not request_exists and not is_friend:
            FriendRequest.objects.create(sender=self, receiver=other_user)

    def accept_friend_request(self, other_user):
        request_exists = self.incoming_friend_requests.filter(sender=other_user).exists()
        is_friend = other_user in self.friends.all()
        if request_exists and not is_friend:
            self.add_friend(other_user)
            other_user.add_friend(self)
            new_chat = Chat.objects.create()
            new_chat.participants.add(self)
            new_chat.participants.add(other_user)
            FriendRequest.objects.filter(sender=other_user, receiver=self).delete()
            FriendRequest.objects.filter(sender=self, receiver=other_user).delete()

    def reject_friend_request(self, other_user):
        FriendRequest.objects.filter(sender=other_user, receiver=self).delete()

    def cancel_friend_request(self, other_user):
        FriendRequest.objects.filter(sender=self, receiver=other_user).delete()


# Friend Request Class
class FriendRequest(models.Model):
    sender = models.ForeignKey(
        User, related_name='outgoing_friend_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        User, related_name='incoming_friend_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


#Book Manager class
class BookManager(models.Manager):
    def search(self, query=None):
        qs = self.get_queryset()
        if query is not None:
            or_lookup = (Q(title__icontains=query) |
                         Q(author__icontains=query) |
                         Q(publisher__icontains=query) |
                         Q(genre__icontains=query)
                        )
            qs = qs.filter(or_lookup).distinct()
        return qs

# Book class
class Book(models.Model):
    ISBN = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=50, blank=False)
    author = models.CharField(max_length=50, blank=False)
    publication_date = models.PositiveIntegerField(
        validators=[MaxValueValidator(datetime.datetime.today().year)], blank=False)
    publisher = models.CharField(max_length=50)
    image_links_large = models.CharField(max_length=500)
    image_links_medium = models.CharField(max_length=500)
    image_links_small = models.CharField(max_length=500)
    genre = models.CharField(max_length=50, blank=False)

    objects = BookManager()

# Book Ratings class
class BookRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    rating = models.IntegerField(
        validators=[MaxValueValidator(10), MinValueValidator(1)])
    created_at = models.DateTimeField(
        auto_now_add=True)  # ? not sure how to test this


def get_new_club_chat():
    new_club_chat = Chat.objects.create(group_chat=True)
    return new_club_chat



#Club Manager class
class ClubManager(models.Manager):
    def search(self, query=None):
        qs = self.get_queryset()
        if query is not None:
            or_lookup = (Q(name__icontains=query) |
                         Q(description__icontains=query)
                        )
            qs = qs.filter(or_lookup).distinct()
        return qs

# Club class
class Club(models.Model):
    name = models.CharField(max_length=50, blank=False)
    description = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # ? not sure how to test this
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    members = models.ManyToManyField(User, related_name='members', blank=True)
    admins = models.ManyToManyField(User, related_name='admins', blank=True)
    applicants = models.ManyToManyField(User, related_name='applicants', blank=True)
    banned_users = models.ManyToManyField(User, related_name='banned_users', blank=True)
    books = models.ManyToManyField('Book', related_name='books', blank=True)
    visibility = models.BooleanField(default=True)
    public = models.BooleanField(default=True)
    club_chat = models.ForeignKey('Chat', related_name='club_chat', on_delete=models.CASCADE, default=get_new_club_chat)

    objects = ClubManager()

    def save(self, *args, **kwargs):
        is_new = not self.pk
        super().save(*args, **kwargs)
        if is_new:  # need to double check if this actually gets only called when new
            self.club_chat.name = self.name
            self.club_chat.participants.add(self.owner)
            self.club_chat.save()

    def add_member(self, user):
        user.add_club(self)
        self.members.add(user)
        self.club_chat.participants.add(user)  # might need to be moved TBD

    def remove_member(self, user):
        user.remove_club(self)
        self.members.remove(user)
        self.club_chat.participants.remove(user)  # might need to be moved TBD

    def member_count(self):
        return self.members.count()

    def add_admin(self, user):
        self.admins.add(user)

    def remove_admin(self, user):
        self.admins.remove(user)

    def admin_count(self):
        return self.admins.count()

    def add_applicant(self, user):
        self.applicants.add(user)

    def remove_applicant(self, user):
        self.applicants.remove(user)

    def applicant_count(self):
        return self.applicants.count()

    def total_people_count(self):
        return self.members.count() + self.admins.count() + 1

    def add_banned_user(self, user):
        user.remove_club(self)
        self.banned_users.add(user)

    def remove_banned_user(self, user):
        user.add_club(self)
        self.banned_users.remove(user)

    def banned_user_count(self):
        return self.banned_users.count()

    def add_book(self, book):
        self.books.add(book)

    def remove_book(self, book):
        self.books.remove(book)

    def book_count(self):
        return self.books.count()

    def switch_visibility(self):
        self.visibility = not self.visibility

    def switch_public(self):
        self.public = not self.public

    def remove_user_from_club(self, user):
        self.members.remove(user)
        self.admins.remove(user)
        self.applicants.remove(user)
        self.banned_users.remove(user)

    def transfer_ownership(self, user):
        self.add_admin(self.owner)
        self.owner = user


# Messaging based on https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ
class Message(models.Model):
    author = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    content = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.username


class Chat(models.Model):
    name = models.CharField(max_length=50, blank=True)
    participants = models.ManyToManyField(User, related_name='chats')
    messages = models.ManyToManyField(Message, blank=True)
    group_chat = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class BookRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_to_recommend_book_to')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='recommended_book_to_user')
    rating = models.FloatField()
    genre = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class UserRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_to_recommend_user_to')
    recommended_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommended_user_to_user')
    diff = models.FloatField()
    method = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class ClubRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_to_recommend_club')
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='recommended_club_to_user')
    diff = models.FloatField()
    method = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class BookRecommendationForClub(models.Model):
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='club_to_recommend_book')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='recommended_book_to_club')
    rating = models.FloatField()
    genre = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class GlobalBookRecommendation(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='book_to_globally_recommend')
    weighted_rating = models.FloatField()
    number_of_ratings = models.IntegerField()
    flat_rating = models.FloatField()
    genre = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class TimePeriod(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()


class TimeVote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time_period = models.ForeignKey(TimePeriod, on_delete=models.CASCADE)


class BookVote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)


class Meeting(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=500, blank=True)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, blank=True, null=True)
    time = models.ForeignKey(TimePeriod, on_delete=models.CASCADE, blank=True, null=True)
    organiser = models.ForeignKey(User, on_delete=models.CASCADE)
    attendees = models.ManyToManyField(User, related_name='attendees', blank=True)
    link = models.CharField(max_length=500, blank=True)


def generate_link():
    return 'We found that using Zoom or Microsoft Teams is expensive. This link is a fake link (but for free)'


class VotingPeriod(models.Model):
    time_period = models.ForeignKey(TimePeriod, on_delete=models.CASCADE, related_name='voting_time')
    book_votes = models.ManyToManyField(BookVote, blank=True)
    time_votes = models.ManyToManyField(TimeVote, blank=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    proposed_books = models.ManyToManyField(Book, blank=True)
    proposed_times = models.ManyToManyField(TimePeriod, blank=True)

    def fill_in_the_meeting(self):
        book = self.get_book_vote()
        time = self.get_time_vote()
        link = generate_link()
        self.meeting.book = book
        self.meeting.time = time
        self.meeting.link = link
        self.meeting.save()

    def get_book_vote(self):
        books_and_votes = {}
        for book_vote in self.book_votes.all():
            if book_vote.book in books_and_votes:
                books_and_votes[book_vote.book] += 1
            else:
                books_and_votes[book_vote.book] = 1
        books_and_votes_list = []
        for book, num in books_and_votes.items():
            books_and_votes_list.append((book, num))
        books_and_votes_list.sort(key=itemgetter(1), reverse=True)
        return books_and_votes_list[0][0]

    def get_time_vote(self):
        times_and_votes = {}
        for time_vote in self.time_votes.all():
            if time_vote.time_period in times_and_votes:
                times_and_votes[time_vote.time_period] += 1
            else:
                times_and_votes[time_vote.time_period] = 1
        times_and_votes_list = []
        for time, num in times_and_votes.items():
            times_and_votes_list.append((time, num))
        times_and_votes_list.sort(key=itemgetter(1), reverse=True)
        return times_and_votes_list[0][0]
