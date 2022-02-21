from django.core.management.base import BaseCommand
from app.models import Book


class Command(BaseCommand):

    def handle(self, *args, **options):
        Book.objects.all().delete()
