import random
import time
from datetime import timedelta, datetime
from django.db.models import Q
from django.utils.timezone import make_aware
from faker import Faker
from django.core.management.base import BaseCommand
from django.db import IntegrityError, transaction
from pandas import read_csv
from app.models import Book, Comment, Reply, User, BookRating, Club, Meeting, get_all_users_related_to_a_club, generate_link, \
    TimePeriod, Post, FriendRequest
from app.management.commands.helpers import print_info


class Command(BaseCommand):
    """A seeder class for seeding all model instances"""

    def handle(self, *args, **options):
        """Main function to seed and time everything"""
        time_function(seed_books)
        time_function(seed_default_objects)
        time_function(seed_users)
        time_function(seed_ratings)
        time_function(seed_clubs)
        time_function(seed_friends)
        time_function(seed_friend_requests)
        time_function(seed_meetings)
        time_function(seed_feed)
        print_info()


def seed_default_objects():
    """Seed a couple of default users"""

    jeb = User.objects.create(
        username="Jeb",
        first_name="Jebediah",
        last_name="Kerman",
        email="jeb@example.org",
        bio="I love chess! I mean books, I love books.",
        location="Somewhere in space I guess",
        birthday=datetime(year=2011, month=6, day=24),
        password="pbkdf2_sha256$260000$VEDi9wsMYG6eNVeL8WSPqj$LHEiR2iUkusHCIeiQdWS+xQGC9/CjhhrjEOESMMp+c0="
    )

    billie = User.objects.create(
        username="Billie",
        first_name="Billie",
        last_name="Kerman",
        email="billie@example.org",
        bio="Never read Fitzgerald? You Gatsby kidding me!",
        location="Actually I'm currently in an undisclosed location.",
        birthday=datetime(year=2011, month=6, day=24),
        password="pbkdf2_sha256$260000$VEDi9wsMYG6eNVeL8WSPqj$LHEiR2iUkusHCIeiQdWS+xQGC9/CjhhrjEOESMMp+c0="
    )

    bob = User.objects.create(
        username="Bob",
        first_name="Bob",
        last_name="Kerman",
        email="bob@example.org",
        bio="My weekend is fully booked.",
        location="London. Just kidding, space!",
        birthday=datetime(year=2011, month=6, day=24),
        password="pbkdf2_sha256$260000$VEDi9wsMYG6eNVeL8WSPqj$LHEiR2iUkusHCIeiQdWS+xQGC9/CjhhrjEOESMMp+c0="
    )

    val = User.objects.create(
        username="Val",
        first_name="Valentina",
        last_name="Kerman",
        email="val@example.org",
        bio="Books are lit! (like literature)",
        location="Somewhere else in space, huh?",
        birthday=datetime(year=2011, month=6, day=24),
        password="pbkdf2_sha256$260000$VEDi9wsMYG6eNVeL8WSPqj$LHEiR2iUkusHCIeiQdWS+xQGC9/CjhhrjEOESMMp+c0="
    )

    books = list(Book.objects.all())
    add_read_and_liked_books(books, jeb)
    add_read_and_liked_books(books, billie)
    add_read_and_liked_books(books, bob)
    add_read_and_liked_books(books, val)
    val.add_friend(jeb)
    val.add_friend(bob)
    val.add_friend(billie)
    jeb.add_friend(val)
    jeb.add_friend(bob)
    jeb.add_friend(billie)
    bob.add_friend(jeb)
    bob.add_friend(val)
    bob.add_friend(billie)
    billie.add_friend(jeb)
    billie.add_friend(bob)
    billie.add_friend(val)

    kerbal = Club.objects.create(
        name="Kerbal book club",
        description="After our success with space programmes, we decided to start a book club",
        owner=jeb
    )
    kerbal.admins.set([bob])
    kerbal.members.set([val, billie])
    kerbal.books.set(get_n_random_books_from(10, books))
    kerbal.save()

    time_period = TimePeriod.objects.create(
        start_time="2013-05-16T17:00:00+00:00",
        end_time="2013-05-16T18:00:00+00:00"
    )

    meeting = Meeting.objects.create(
        name="Kerbal book meeting number 1",
        description="Reading books but also space, what else could you possibly need?",
        club=kerbal,
        book=get_n_random_books_from(1, books)[0],
        time=time_period,
        organiser=jeb,
        link=generate_link()
    )

    meeting.attendees.set([val, billie, bob])
    meeting.save()



def seed_books():
    """Seed all the books from the csv file with genres

    NOTE: Takes about 2 minutes on a macbook air

    """

    # Load data from csv file
    filepath = 'app/files/BX_Books_genres.csv'
    df = read_csv(filepath, na_filter=False)
    # Insert to database
    total = len(df)
    books_db = []
    for i in range(total):
        book = df.iloc[i]
        book_db = Book(ISBN=book['ISBN'])
        book_db.title = book['Book-Title']
        book_db.author = book['Book-Author']
        book_db.publication_date = book['Year-Of-Publication']
        book_db.publisher = book['Publisher']
        book_db.image_links_large = book['Image-URL-L']
        book_db.image_links_medium = book['Image-URL-M']
        book_db.image_links_small = book['Image-URL-S']
        book_db.genre = book['Genre']
        if (i + 1) % 10000 == 0:
            print(f'{i + 1}/{total} books inserted...')
        books_db.append(book_db)
    Book.objects.bulk_create(books_db)
    print('----- ALL BOOKS INSERTED TO DATABASE -----')


def seed_users(number=150):
    """Seed all the users

    NOTE: Takes about a minute on a macbook air

    """

    user_counter = 0
    faker = Faker('en_GB')
    books = list(Book.objects.all())
    while user_counter < number:
        try:
            with transaction.atomic():
                create_user(faker, books)
                user_counter += 1
        except IntegrityError:
            print("This username was already taken")
        if user_counter % 10 == 0:
            print(f'{user_counter}/{number} users inserted...')
    print('----- ALL USERS INSERTED TO DATABASE -----')


def seed_ratings():
    """Seed a random number of ratings for each user"""

    min_num_of_ratings = 4
    max_num_of_ratings = 20

    users = User.objects.all()
    for user in users:
        read_books = user.read_books.all()
        rated_books = get_n_random_books_from(random.randint(min_num_of_ratings, max_num_of_ratings), list(read_books))
        for book in rated_books:
            BookRating.objects.create(
                user=user,
                book=book,
                rating=random.randint(1, 10)
            )
        print(f'Created all reviews for {user}')
    print('----- ALL RATINGS INSERTED TO DATABASE -----')


def seed_clubs(num_of_clubs=15):
    """Seed a number of clubs in the application"""

    min_num_of_members = 2
    max_num_of_members = 15
    min_num_of_admins = 1
    max_num_of_admins = 3
    min_num_of_applicants = 3
    max_num_of_applicants = 7
    min_num_of_books = 5
    max_num_of_books = 25
    faker = Faker('en_GB')
    books = list(Book.objects.all())

    for i in range(0, num_of_clubs):
        try:
            club = create_club(faker)
            club = generate_club_users(club, random.randint(min_num_of_members, max_num_of_members),
                                       random.randint(min_num_of_admins, max_num_of_admins),
                                       random.randint(min_num_of_applicants, max_num_of_applicants))
            club = generate_club_books(club, random.randint(min_num_of_books, max_num_of_books), books)
            club.save()
            print(f'{i + 1}/{num_of_clubs} club has been created')
        except IntegrityError:
            print("This club name was already taken")


def seed_friends():
    """Seed a number of friends"""

    min_number_of_friends = 2
    max_number_of_friends = 10
    for user in User.objects.all():
        num_of_friends = random.randint(min_number_of_friends, max_number_of_friends)
        potential_friends = get_n_random_users(num_of_friends)
        if user in potential_friends:
            potential_friends.remove(user)
        for friend in potential_friends:
            user.add_friend(friend)
        user.save()
        print(f'Created all friends for {user}')

def seed_friend_requests():
    """Seed a number of friend requests"""

    min_number_of_friend_requests = 2
    max_number_of_friend_requests = 10
    for user in User.objects.all():
        num_of_friend_requests = random.randint(min_number_of_friend_requests, max_number_of_friend_requests)
        potential_non_friends = get_n_random_non_friends(num_of_friend_requests, user)
        for non_friend in potential_non_friends:
            user.send_friend_request(non_friend)
        print(f'Created all friend requests for {user}')


def seed_meetings():
    """Seed a number of meetings"""

    min_number_of_meetings = 1
    max_number_of_meetings = 8
    faker = Faker('en_GB')
    for club in Club.objects.all():
        num_of_meetings = random.randint(min_number_of_meetings, max_number_of_meetings)
        for i in range(0, num_of_meetings):
            create_meeting(club, faker, i)
        print(f'Created all meetings for {club}')


def seed_feed():
    """Main seeder for seeding posts, comments, and replies"""

    min_number_of_posts = 0
    max_number_of_posts = 2
    faker = Faker('en_GB')
    for user in User.objects.all():
        num_of_posts = random.randint(min_number_of_posts, max_number_of_posts)
        for i in range(0, num_of_posts):
            post = create_post(user, faker)
            seed_comments_and_replies(post, user)
        print(f'Created all posts for {user}')

def seed_comments_and_replies(post, user):
    """Helper to seed a number of comments and replies for a post"""
    min_number_of_comments = 0
    max_number_of_comments = 1
    faker = Faker('en_GB')
    for friend in user.friends.all():
        num_of_comments = random.randint(min_number_of_comments, max_number_of_comments)
        for i in range(0, num_of_comments):
            comment = create_comment(friend, faker, post)
            seed_replies(comment, user)
        print(f'Created all comments for {friend}')


def seed_replies(comment, user):
    """Helper to seed a number of replies for a comment"""
    min_number_of_replies = 0
    max_number_of_replies = 1
    faker = Faker('en_GB')
    for friend in user.friends.all():
        num_of_replies = random.randint(min_number_of_replies, max_number_of_replies)
        for i in range(0, num_of_replies):
            create_reply(friend, faker, comment)
        print(f'Created all replies for {friend}')


def create_user(faker, books):
    """Create a user with random data from faker and randomly liked and read books"""

    username = faker.user_name()
    email = faker.email()
    first_name = faker.first_name()
    last_name = faker.last_name()
    bio = faker.text(max_nb_chars=500)
    location = faker.city()
    birthday = faker.date_of_birth(minimum_age=15, maximum_age=115)

    user = User.objects.create(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        bio=bio,
        location=location,
        birthday=birthday,
        password="pbkdf2_sha256$260000$VEDi9wsMYG6eNVeL8WSPqj$LHEiR2iUkusHCIeiQdWS+xQGC9/CjhhrjEOESMMp+c0="
    )

    add_read_and_liked_books(books, user)


def add_read_and_liked_books(books, user):
    """Add read and liked books to a user"""

    read_books = get_n_random_books_from(n=35, books=books)
    liked_books = get_n_random_books_from(n=15, books=read_books)
    user.read_books.set(read_books)
    user.liked_books.set(liked_books)
    user.save()


def create_meeting(club, faker, counter):
    """Create a meeting"""

    name = club.name + f' meeting #{counter}'
    book = Book.objects.all()[random.randint(0, Book.objects.count() - 1)]
    users = get_all_users_related_to_a_club(club)
    # All meetings are between 14 and 20 (because my test meeting at 2:11 am looked really silly)
    start_time = datetime.combine(faker.date_between(start_date='-1y', end_date='+1y'),
                                  datetime.min.time()) + timedelta(hours=random.randint(14, 20))
    time_period = TimePeriod.objects.create(
        start_time=make_aware(start_time),
        end_time=make_aware(start_time + timedelta(hours=1))
    )
    random.shuffle(users)
    meeting = Meeting.objects.create(
        name=name,
        description=faker.text(random.randint(50, 500)),
        club=club,
        book=book,
        organiser=users[0],
        link=generate_link(),
        time=time_period
    )
    meeting.attendees.set(users[1: random.randint(2, len(users))])
    meeting.save()


def create_post(user, faker):
    """Create a post"""

    return Post.objects.create(
        author=user,
        title=faker.text(random.randint(10, 100)),
        content=faker.text(random.randint(50, 500)),
        upvotes=random.randint(0, 5),
        downvotes=random.randint(0, 5)
    )

def create_comment(user, faker, post):
    """Create a comment"""

    return Comment.objects.create(
        author=user,
        content=faker.text(random.randint(50, 500)),
        upvotes=random.randint(0, 5),
        downvotes=random.randint(0, 5),
        post=post
    )

def create_reply(user, faker, comment):
    """Create a reply"""

    return Reply.objects.create(
        author=user,
        content=faker.text(random.randint(50, 500)),
        upvotes=random.randint(0, 5),
        downvotes=random.randint(0, 5),
        comment=comment
    )


def get_n_random_books_from(n, books):
    """Get n random books from a list"""

    copy = books
    random.shuffle(copy)
    return copy[0:n]


def create_club(faker):
    """Create one club with random data from faker"""

    name = faker.city() + ' Book Club'
    description = faker.text(random.randint(50, 500))
    owner = get_user()
    visibility = random.randint(0, 1) == 0
    public = random.randint(0, 1) == 0

    return Club.objects.create(
        name=name,
        description=description,
        owner=owner,
        visibility=visibility,
        public=public
    )


def get_user():
    """Get one random user"""

    return list(User.objects.all())[random.randint(0, User.objects.count() - 1)]


def get_n_random_users(n):
    """Get n random users"""

    users = list(User.objects.all())
    random.shuffle(users)
    return users[0: n]

def get_n_random_non_friends(n, user):
    """Get n random non-friends of a user"""
    friends_and_user = list(user.friends.all()) + [user]
    non_friend_users = list(User.objects.exclude(Q(user__in=friends_and_user)))
    random.shuffle(non_friend_users)
    return non_friend_users[0: n]


def generate_club_users(club, num_of_members, num_of_admins, num_of_applicants):
    """Generate club users for a club

    Generates members, admins and applicants

    """

    users = get_n_random_users(num_of_members + num_of_admins + num_of_applicants)
    # Make sure the owner doesn't have any other roles in the club
    if club.owner in users:
        users.remove(club.owner)

    members = users[0: num_of_members]
    admins = users[num_of_members: num_of_members + num_of_admins]
    applicants = users[num_of_members + num_of_admins:]
    club.members.set(members)
    club.admins.set(admins)
    club.applicants.set(applicants)
    return club


def generate_club_books(club, num_of_books, books):
    """Generate a number of random books for the club"""

    books = get_n_random_books_from(num_of_books, books)
    club.books.set(books)
    return club


def time_function(func):
    """A function to time runtime of another function"""

    start = time.time()
    func()
    end = time.time()
    print(f'The function took {end - start} seconds')
