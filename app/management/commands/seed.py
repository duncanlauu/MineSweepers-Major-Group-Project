import random
import time

from faker import Faker
from django.core.management.base import BaseCommand
from django.db import IntegrityError, transaction
from pandas import read_csv
from app.models import Book, User, BookRating, Club


class Command(BaseCommand):
    """A seeder class for seeding books, users and user ratings"""

    def handle(self, *args, **options):
        time_function(seed_books)
        time_function(seed_users)
        time_function(seed_ratings)
        time_function(seed_clubs)


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
            print(f'{i + 1}/{total} inserted...')
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

    min_num_of_ratings = 2
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

    read_books = get_n_random_books_from(n=35, books=books)
    liked_books = get_n_random_books_from(n=15, books=read_books)
    user.read_books.set(read_books)
    user.liked_books.set(liked_books)


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
