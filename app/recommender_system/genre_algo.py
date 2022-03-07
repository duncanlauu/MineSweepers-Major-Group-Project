"""
Genre-Related Algorithms
Note that genres are treated as case-insensitive
"""

from app.models import Book
from django.db.models import F, Func, Count
import requests


def _simple_get_google_api_genre(isbn):
    """Get genre of book from ISBN using the Google Books API"""
    r = requests.get(
        f'https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&fields=items/volumeInfo/categories')
    if r.status_code != requests.codes.ok:
        return "ERROR"
    if len(r.json()) == 0:
        return "N/A"
    # If multiple books are returned, pick first one
    categories_ls = r.json()['items'][0]['volumeInfo']['categories']
    # If multiple categories are returned, pick first one
    return categories_ls[0]


def get_google_api_genre(isbn, timeout=50):
    """
    Get genre of book from ISBN using the Google Books API
    There is a limit to the number of requests per minute to the Google Books API
    This function will keep trying to request until there is a successful response or reach timeout
    """
    for i in range(timeout):
        r = _simple_get_google_api_genre(isbn)
        if r != 'ERROR':
            return r
    return 'TIMEOUT'


def get_genre(isbn):
    """Get genre of book from ISBN"""
    try:
        return Book.objects.get(ISBN=isbn).genre
    except Book.DoesNotExist:
        return None


def get_books_from_iexact_genre(genre):
    """Get all books with an exact case-insensitive genre keyword"""
    return list(Book.objects.filter(genre__iexact=genre))


def get_books_from_similar_genre(genre):
    """Get all books that contain a case-insensitive keyword in their genres"""
    return list(Book.objects.filter(genre__icontains=genre)
                .exclude(genre__icontains=f'non{genre}')
                .exclude(genre__icontains=f'non-{genre}'))
    # After data inspection, these exclusions are enough for this dataset


def _get_books_count_per_raw_genre_queryset():
    """Get a queryset of genre to its corresponding number of books excluding 'N/A' genres"""
    return (Book.objects.values('genre')
            .exclude(genre='N/A')
            .annotate(genres_lowercase=(Func(F('genre'), function='LOWER')))
            .values('genres_lowercase')
            .annotate(total=Count('genres_lowercase')))


def _get_top_n_raw_genres(n):
    """Get top n genres based on its corresponding number of books excluding 'N/A' genres"""
    ordered_qs = _get_books_count_per_raw_genre_queryset().order_by('-total')
    if len(ordered_qs) >= n:
        return [ordered_qs[i]['genres_lowercase'] for i in range(n)]
    else:  # If n is larger than number of genres, return whole sorted
        return [row['genres_lowercase'] for row in ordered_qs]


def _is_subgenre_of(subgenre, genre):
    """Checks if a genre is a subgenre of another taking into account negating 'non' keywords"""
    if genre in subgenre:
        # After data inspection, these negating phrases are enough for this dataset
        if f'non{genre}' in subgenre or f'non-{genre}' in subgenre:
            return False
        else:
            return True
    else:
        return False


def _merge_genres(genres):
    """Merge similar genres in a given list of genres"""
    i = 0
    while i < len(genres):
        j = i + 1
        while j < len(genres):
            if _is_subgenre_of(genres[j], genres[i]) and genres[i] != genres[j]:
                genres.pop(j)
                j -= 1
            elif _is_subgenre_of(genres[i], genres[j]) and genres[i] != genres[j]:
                genres.pop(i)
                i -= 1
                break
            j += 1
        i += 1


def get_top_n_merged_genres(n=25, safety_offset=2):
    """Get a list of the top n genres after merging similar genres"""
    genres = _get_top_n_raw_genres(round(n * safety_offset))
    genres_processed_count = len(genres)
    need_more_genres = True
    while need_more_genres:
        need_more_genres = False
        _merge_genres(genres)
        if len(genres) < n:
            need_more_genres = True
            more_genres_count = max(
                round(n * safety_offset) - n, n - len(genres))
            genres += _get_top_n_raw_genres(genres_processed_count + more_genres_count)[
                genres_processed_count:]
            genres_processed_count += more_genres_count
    return genres[:n]


def get_top_n_merged_genres_with_books(n=25):
    """Get a list of tuples (genre, books_list) based on the top n merged genres"""
    merged_genres = get_top_n_merged_genres(n)
    return list(map(lambda g: (g, get_books_from_similar_genre(g)), merged_genres))


def get_isbns_for_a_genre(genre, trainset):
    """Get all the rated books for a given genre"""
    books = get_books_from_iexact_genre(genre)
    items_with_the_genre = (book.ISBN for book in books)
    rated_items = list((trainset.to_raw_iid(iid) for iid in trainset.all_items()))
    # Make sure the books are in the system (are rated at least once)
    items = list(set(rated_items).intersection(items_with_the_genre))
    return items