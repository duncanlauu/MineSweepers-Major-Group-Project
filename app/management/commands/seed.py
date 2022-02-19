from django.core.management.base import BaseCommand
from pandas import read_csv
from app.models import Book


class Command(BaseCommand):

    def handle(self, *args, **options):
        # Load data from csv file
        filepath = 'app/csv_files/BX_Books_genres.csv'
        df = read_csv(filepath, na_filter=False)

        # Insert to database
        total = len(df)
        for i in range(total):
            book = df.iloc[i]
            Book.objects.create(
                ISBN=book['ISBN'],
                title=book['Book-Title'],
                author=book['Book-Author'],
                publication_date=book['Year-Of-Publication'],
                publisher=book['Publisher'],
                image_links_large=book['Image-URL-L'],
                image_links_medium=book['Image-URL-M'],
                image_links_small=book['Image-URL-S'],
                genre=book['Genre']
            )
            if (i+1) % 10000 == 0:
                print(f'{i+1}/{total} inserted...')

        print('----- ALL BOOKS INSERTED TO DATABASE -----')
