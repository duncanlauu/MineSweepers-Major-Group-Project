"""Genre-Related Algorithms

Note that genres are treated as case-insensitive
"""

from app.models import Book
from django.db.models import F, Func, Count


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
    # TODO: distinguish between 'fiction' and 'nonfiction' for example
    return list(Book.objects.filter(genre__icontains=genre))


def get_books_count_per_genre_queryset():
    """Get a queryset of genre to its corresponding number of books excluding 'N/A' genres"""
    return (Book.objects.values('genre')
            .exclude(genre='N/A')
            .annotate(genres_lowercase=(Func(F('genre'), function='LOWER')))
            .values('genres_lowercase')
            .annotate(total=Count('genres_lowercase')))


def get_books_count_per_genre_dictionary():
    """Get a dictionary of genre to its corresponding number of books excluding 'N/A' genres"""
    qs = get_books_count_per_genre_queryset()
    result = {row['genres_lowercase']: row['total'] for row in qs}
    return result


def get_top_n_genres(n=10):
    """Get top n genres based on its corresponding number of books excluding 'N/A' genres"""
    ordered_qs = get_books_count_per_genre_queryset().order_by('-total')
    if len(ordered_qs) >= n:
        return [ordered_qs[i]['genres_lowercase'] for i in range(n)]
    else:  # If n is larger than number of genres, return whole sorted
        return [row['genres_lowercase'] for row in ordered_qs]
