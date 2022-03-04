import datetime
from pickle import TRUE
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone

#It uses datetime.date which only uses the date
def PastDateValidator(date):
        if date > datetime.date.today():
            raise ValidationError("Date cannot be in the future")


#It uses datetime.datetime which includes hours too
def FutureDateValidator(date):
        if date < timezone.now():
            raise ValidationError("Date cannot be in the past")


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
    first_name = models.CharField(max_length=50, blank= False)
    last_name = models.CharField(max_length=50, blank= False)
    bio = models.CharField(max_length=500, blank= True)
    location = models.CharField(max_length=70, blank= True)
    birthday = models.DateField(validators=[PastDateValidator],blank =False, null =True)
    created_at = models.DateTimeField(auto_now_add=True) ##? sure how to test this
    liked_books = models.ManyToManyField('Book', related_name='liked_books', blank=True) # blank true for development purposes.
    read_books = models.ManyToManyField('Book', related_name='read_books', blank=True) # blank true for development purposes.
    clubs = models.ManyToManyField('Club', related_name='clubs', blank=True, null=True)

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






#Book class
class Book(models.Model):
    ISBN = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=50, blank=False)
    author = models.CharField(max_length=50, blank=False)
    publication_date = models.PositiveIntegerField(validators=[MaxValueValidator(datetime.datetime.today().year)], blank=False)
    publisher = models.CharField(max_length=50)
    image_links_large = models.CharField(max_length=500)
    image_links_medium = models.CharField(max_length=500)
    image_links_small = models.CharField(max_length=500)
    genre = models.CharField(max_length=50, blank=False)

#Book Ratings class
class BookRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MaxValueValidator(10), MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True) ##? not sure how to test this

#Meeting class
class Meeting(models.Model):
    start_time = models.DateTimeField(blank =False, validators=[FutureDateValidator])
    end_time = models.DateTimeField(blank=False, validators=[FutureDateValidator])
    discussion_leader = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=70, blank=True)
    link = models.CharField(max_length=500, unique=True, blank=True)

#Vote class
class Vote(models.Model):
    event_vote = models.ManyToManyField('EventVote', related_name='event_vote')
    start_time = models.DateTimeField(validators=[FutureDateValidator], blank=False)
    end_time = models.DateTimeField(validators=[FutureDateValidator], blank=False)

    def add_event_vote(self, event_vote):
        self.event_vote.add(event_vote)

    def remove_event_vote(self, event_vote):
        self.event_vote.remove(event_vote)

    def event_vote_count(self):
        return self.event_vote.count()

#Club event class
class ClubEvent(models.Model):
    club_id = models.ForeignKey('Club', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    voting_time = models.ForeignKey(Vote, on_delete=models.CASCADE)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    description = models.CharField(max_length=500, blank=True)


#EventVote class
class EventVote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)


#Club class
class Club(models.Model):
    name = models.CharField(max_length=50,blank=False)
    description = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) ##? not sure how to test this
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    members = models.ManyToManyField(User, related_name='members', null=True, blank=True)
    admins = models.ManyToManyField(User, related_name='admins', null=True, blank=True)
    applicants = models.ManyToManyField(User, related_name='applicants', null=True, blank=True)
    banned_users = models.ManyToManyField(User, related_name='banned_users', null=True, blank=True)
    books = models.ManyToManyField('Book', related_name='books', null=True, blank=True)
    visibility = models.BooleanField(default=True)
    public = models.BooleanField(default=True)

    def add_member(self, user):
        user.add_club(self)
        self.members.add(user)

    def remove_member(self, user):
        user.remove_club(self)
        self.members.remove(user)

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
