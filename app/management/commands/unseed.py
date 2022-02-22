from django.core.management.base import BaseCommand
from app.models import Book, User, BookRating


class Command(BaseCommand):

    def handle(self, *args, **options):
        User.objects.all().delete()
        Book.objects.all().delete()
