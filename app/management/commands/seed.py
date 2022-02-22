import random
import time

from faker import Faker
from django.core.management.base import BaseCommand
from django.db import IntegrityError
from pandas import read_csv
from app.models import Book, User, BookRating


def seed_books():
    """Seed all the books from the csv file with genres

    NOTE: Takes about 13 minutes on Mikolaj's computer

    """

    # Load data from csv file
    filepath = 'app/csv_files/BX_Books_genres.csv'
    df = read_csv(filepath, na_filter=False)
    # Insert to database
    total = len(df)
    for i in range(total):
        book = df.iloc[i]
        Book.objects.create(
            ISBN=book['ISBN'],
            title=book['Book-Title'],
            author=book['Book-Author'],
            publication_date=book['Year-Of-Publication'],
            publisher=book['Publisher'],
            image_links_large=book['Image-URL-L'],
            image_links_medium=book['Image-URL-M'],
            image_links_small=book['Image-URL-S'],
            genre=book['Genre']
        )
        if (i + 1) % 10000 == 0:
            print(f'{i + 1}/{total} inserted...')
    print('----- ALL BOOKS INSERTED TO DATABASE -----')


def seed_users(number=150):
    """Seed all the users

    NOTE: Takes about a minute on Mikolaj's computer

    """

    user_counter = 0
    faker = Faker('en_GB')
    books = list(Book.objects.all())
    while user_counter < number:
        try:
            create_user(faker, books)
            user_counter += 1
        except IntegrityError:
            print("This username was already taken")
        if user_counter % 10 == 0:
            print(f'{user_counter}/{number} inserted...')
    print('----- ALL USERS INSERTED TO DATABASE -----')


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


def time_function(func):
    """A function to time runtime of another function"""

    start = time.time()
    func()
    end = time.time()
    print(f'The function took {end - start} seconds')


class Command(BaseCommand):
    """A seeder class for seeding books, users and user ratings"""

    def handle(self, *args, **options):
        time_function(seed_books)
        time_function(seed_users)
        time_function(seed_ratings)

