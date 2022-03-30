from django.core.management.base import BaseCommand
from app.models import Book, Comment, Reply, User, BookRating, TimePeriod, Meeting, Post, Club, Chat
from app.management.commands.helpers import print_info


class Command(BaseCommand):
    """A class for unseeding all objects from the database"""

    def handle(self, *args, **options):
        # Do not remove superusers
        print_info()
        print("----- UNSEEDING... -----")
        User.objects.filter(is_superuser=False, is_staff=False).delete()
        Book.objects.all().delete()
        Chat.objects.all().delete()
        TimePeriod.objects.all().delete()
        print_info()
