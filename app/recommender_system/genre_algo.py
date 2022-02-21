"""
Genre-Related Algorithms
Note that genres are treated as case-insensitive
"""

from app.models import Book


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
    return list(Book.objects.filter(genre__icontains=genre))  # TODO: distinguish between 'fiction' and 'nonfiction' for example


def get_books_count_per_genre():
    """Get a dictionary of genre to its corresponding number of books"""
    result = {}
    genres = set([g.lower() for g in Book.objects.values_list(
        'genre', flat=True).distinct()])
    for genre in genres:
        print(genre)
        result[genre] = len(get_books_from_iexact_genre(genre))
    return result

def get_top_n_genres(n=10):
    """Get top n genres based on its corresponding number of books"""
    ordered_genres = sorted(get_books_count_per_genre().items(), key=lambda e: e[1])
    if len(ordered_genres) >= n:
        return ordered_genres[:n]
    else:
        # If n is larger than number of genres, return whole sorted 
        return ordered_genres