from django.core.management.base import BaseCommand
from app.models import Book, User


class Command(BaseCommand):

    def handle(self, *args, **options):
        # Book.objects.all().delete()
        User.objects.filter(is_superuser=False, is_staff=False).delete()
