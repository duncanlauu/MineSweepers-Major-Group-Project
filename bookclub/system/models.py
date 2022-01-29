from django.db import models

# Create your models here.

# User class
class User(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    bio = models.TextField(max_length=500)
    location = models.CharField(max_length=70)
    age = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    liked_books = models.ManyToManyField('Book', related_name='liked_books')
    read_books = models.ManyToManyField('Book', related_name='read_books')

#Book class
class Book(models.Model):
    ISBN = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    publication_date = models.DateField()
    publisher = models.CharField(max_length=50)
    image_links_large = models.CharField(max_length=500)
    image_links_medium = models.CharField(max_length=500)
    image_links_small = models.CharField(max_length=500)

#Book Ratings class
class BookRatings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    rating = models.IntegerField(range = (0,10))
    created_at = models.DateTimeField(auto_now_add=True)

#Meeting class
class Meeting(models.Model):
    club_event = models.ForeignKey('ClubEvent', on_delete=models.CASCADE)
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
    book = models.ForeignKey(Book)
    voting_time = models.ForeignKey(Vote)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    description = models.TextField(max_length=500)


#EventVote class
class EventVote(models.Model):
    event_id = models.ForeignKey('ClubEvent', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    
#Club class
class Club(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    members = models.ManyToManyField(User, related_name='members')
    admins = models.ManyToManyField(User, related_name='admins')
    applicants = models.ManyToManyField(User, related_name='applicants')
    banned_users = models.ManyToManyField(User, related_name='banned_users')
    books = models.ManyToManyField('Book', related_name='books')
    visibility = models.BooleanField(default=True)
    public = models.BooleanField(default=True)

