from django.core.management.base import BaseCommand
from app.models import Book, User, Club


class Command(BaseCommand):
    """A class for unseeding all objects from the database"""

    def handle(self, *args, **options):
        # Do not remove superusers
        User.objects.filter(is_superuser=False, is_staff=False).delete()
        Book.objects.all().delete()
        Club.objects.all().delete()
