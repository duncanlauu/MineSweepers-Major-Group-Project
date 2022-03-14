from django.core.management import BaseCommand

from app.recommender_system.entry_point import recommender_system_tests


class Command(BaseCommand):
    """A simple command running some recommender system tests"""

    def handle(self, *args, **options):
        recommender_system_tests()
