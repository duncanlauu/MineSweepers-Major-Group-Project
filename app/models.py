import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
# User class

def DateValidator(date):
        if date > datetime.date.today():
            raise ValidationError("Date cannot be in the future")
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
    birthday = models.DateField(blank =False, validators=[DateValidator])
    created_at = models.DateTimeField(auto_now_add=True) ##? sure how to test this
    liked_books = models.ManyToManyField('Book', related_name='liked_books')
    read_books = models.ManyToManyField('Book', related_name='read_books')

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


    


#Book class
class Book(models.Model):
    ISBN = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=50, blank=False, unique=True)
    author = models.CharField(max_length=50, blank=False)
    publication_date = models.DateField(blank =False, validators=[DateValidator])
    publisher = models.CharField(max_length=50)
    image_links_large = models.CharField(max_length=500)
    image_links_medium = models.CharField(max_length=500)
    image_links_small = models.CharField(max_length=500)

#Book Ratings class
class BookRatings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    rating = models.IntegerField() # Add range constraint 0-10
    created_at = models.DateTimeField(auto_now_add=True)

#Meeting class
class Meeting(models.Model):
    club_event = models.ForeignKey('ClubEvent', on_delete=models.CASCADE, related_name="clubevent")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    discussion_leader = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=70)
    link = models.CharField(max_length=500)

#Vote class
class Vote(models.Model):
    club_event = models.ForeignKey('ClubEvent', on_delete=models.CASCADE)
    event_vote = models.ManyToManyField('EventVote', related_name='event_vote')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

#Club event class
class ClubEvent(models.Model):
    club_id = models.ForeignKey('Club', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE) # on_delete CASCADE might be wrong
    voting_time = models.ForeignKey(Vote, on_delete=models.CASCADE) # on_delete CASCADE might be wrong
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    description = models.TextField(max_length=500)


#EventVote class
class EventVote(models.Model):
    event_id = models.ForeignKey('ClubEvent', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)


#Club class
class Club(models.Model):
    name = models.CharField(max_length=50,blank=False)
    description = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) ##? not sure how to test this
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    members = models.ManyToManyField(User, related_name='members')
    admins = models.ManyToManyField(User, related_name='admins')
    applicants = models.ManyToManyField(User, related_name='applicants')
    banned_users = models.ManyToManyField(User, related_name='banned_users')
    books = models.ManyToManyField('Book', related_name='books')
    visibility = models.BooleanField(default=True)
    public = models.BooleanField(default=True)

    def add_member(self, user):
        self.members.add(user)

    def remove_member(self, user):
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
        self.banned_users.add(user)

    def remove_banned_user(self, user):
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


