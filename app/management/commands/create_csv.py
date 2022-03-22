# use the top n global to get 4k books and save all the info in a csv
import pandas as pd
from django.core.management import BaseCommand

from app.models import Book
from app.recommender_system.books_recommender import get_global_top_n
from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset, get_dataframe_from_file


def create_ratings_file():
    file_path = 'app/files/BX-Book-Ratings.csv'
    filtered_file_path = 'app/files/BX-Book-Ratings-deployed.csv'
    ratings = get_dataframe_from_file(file_path)
    print(ratings)
    ratings.to_csv(index=False, path_or_buf=filtered_file_path)


def create_books_file():
    number = 4000
    file_path = 'app/files/BX-Book-Ratings-filtered.csv'
    dataframe = get_combined_data(file_path)
    data = get_dataset_from_dataframe(dataframe)
    trainset = get_trainset_from_dataset(data)
    top_books = list((row[0] for row in get_global_top_n(dataframe, trainset.global_mean, number)))
    rows = {'ISBN': [], 'Book-Title': [], 'Book-Author': [], 'Year-Of-Publication': [], 'Publisher': [],
            'Image-URL-S': [], 'Image-URL-M': [], 'Image-URL-L': [], 'Genre': []}
    for book_id in top_books:
        book = Book.objects.get(pk=book_id)
        rows['ISBN'].append(book.ISBN)
        rows['Book-Title'].append(book.title)
        rows['Book-Author'].append(book.author)
        rows['Year-Of-Publication'].append(book.publication_date)
        rows['Publisher'].append(book.publisher)
        rows['Image-URL-S'].append(book.image_links_small)
        rows['Image-URL-M'].append(book.image_links_medium)
        rows['Image-URL-L'].append(book.image_links_large)
        rows['Genre'].append(book.genre)
    filtered_file_path = 'app/files/BX-Book-genres-deployed.csv'
    dataframe = pd.DataFrame.from_dict(rows)
    print(dataframe)
    dataframe.to_csv(index=False, path_or_buf=filtered_file_path)


class Command(BaseCommand):
    """A class for creating the deployment version of dataset"""

    def handle(self, *args, **options):
        # create_books_file()
        create_ratings_file()
