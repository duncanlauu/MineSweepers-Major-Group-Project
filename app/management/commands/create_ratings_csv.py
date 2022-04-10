from django.core.management import BaseCommand

from app.recommender_system.file_management import get_dataframe_from_file


def create_ratings_file(number_of_ratings):
    """Create the ratings file"""

    file_path = 'app/files/BX-Book-Ratings.csv'
    filtered_file_path = 'app/files/BX-Book-Ratings-deployed.csv'
    # This filters out the ratings for books that are not in the database
    ratings = get_dataframe_from_file(file_path)
    print(ratings)
    ratings = ratings.head(number_of_ratings)
    ratings.to_csv(index=False, path_or_buf=filtered_file_path)


class Command(BaseCommand):
    """
    A class for creating the deployment version of the ratings dataset

    It assumes that the database is seeded with the limited books.
    """

    def handle(self, *args, **options):
        create_ratings_file(150000)
