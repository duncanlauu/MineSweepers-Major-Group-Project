# use the top n global to get 3k books and save all the info in a csv
import pandas as pd
from django.core.management import BaseCommand

from app.models import Book
from app.recommender_system.books_recommender import get_global_top_n
from app.recommender_system.file_management import get_combined_data, get_dataset_from_dataframe, \
    get_trainset_from_dataset


def create_books_file():
    number = 3000
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
        rows['Image-URL-S'].append(fix_url(book.image_links_small))
        rows['Image-URL-M'].append(fix_url(book.image_links_medium))
        rows['Image-URL-L'].append(fix_url(book.image_links_large))
        rows['Genre'].append(book.genre)
    filtered_file_path = 'app/files/BX-Book-genres-deployed.csv'
    dataframe = pd.DataFrame.from_dict(rows)
    print(dataframe)
    dataframe.to_csv(index=False, path_or_buf=filtered_file_path)


def fix_url(url):
    """
    Change the url to be https

    Chrome replaced http with https in the address which was breaking all the images. I found this
    https://stackoverflow.com/questions/40430694/how-to-access-amazon-images-with-https-awsecommerceservice
    and it seems to help
    """

    return url.replace("http://images.amazon.com", "https://images-na.ssl-images-amazon.com")


class Command(BaseCommand):
    """A class for creating the deployment version of dataset"""

    def handle(self, *args, **options):
        create_books_file()
