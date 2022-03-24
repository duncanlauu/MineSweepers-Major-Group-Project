from django.core.management.base import BaseCommand
from app.models import Book, Comment, Reply, User, BookRating, TimePeriod, Meeting, Post, Club


def print_info():
    print(f'Number of users: {User.objects.count()}')
    print(f'Number of books: {Book.objects.count()}')
    print(f'Number of book ratings: {BookRating.objects.count()}')
    print(f'Number of clubs: {Club.objects.count()}')
    print(f'Number of posts: {Post.objects.count()}')
    print(f'Number of comments: {Comment.objects.count()}')
    print(f'Number of replies: {Reply.objects.count()}')
    print(f'Number of meetings: {Meeting.objects.count()}')
    print(f'Number of time periods: {TimePeriod.objects.count()}')


class Command(BaseCommand):
    """A class for unseeding all objects from the database"""

    def handle(self, *args, **options):
        # Do not remove superusers
        print_info()
        print("----- UNSEEDING... -----")
        User.objects.filter(is_superuser=False, is_staff=False).delete()
        Book.objects.all().delete()
        TimePeriod.objects.all().delete()
        print_info()
