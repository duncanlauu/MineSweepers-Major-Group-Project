"""
Genre-Related Algorithms
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


def _get_top_n_merged_genres_recurse(n, genres, merged_count):
    """Recursive function helper for get_top_n_merged_genres"""
    for i in range(len(genres)):
        for j in range(i + 1, len(genres)):
            if _is_subgenre_of(genres[j], genres[i]) and genres[i] != genres[j]:
                genres.pop(j)
                genres.append(_get_top_n_raw_genres(n+1 + merged_count)[-1])
                merged_count += 1
                return True, genres, merged_count
            if _is_subgenre_of(genres[i], genres[j]) and genres[i] != genres[j]:
                genres.pop(i)
                genres.append(_get_top_n_raw_genres(n+1 + merged_count)[-1])
                merged_count += 1
                return True, genres, merged_count
    return False, genres, merged_count


def get_top_n_merged_genres(n=25):
    """Get a list of the top n genres after merging similar genres"""
    merged_count = 0
    is_updated = True
    genres = _get_top_n_raw_genres(n)
    while is_updated:
        is_updated, genres, merged_count = _get_top_n_merged_genres_recurse(
            n, genres, merged_count)
    return genres


def get_top_n_merged_genres_with_books(n=25):
    """Get a list of tuples (genre, books_list) based on the top n merged genres"""
    merged_genres = get_top_n_merged_genres(n)
    return list(map(lambda g: (g, get_books_from_similar_genre(g)), merged_genres))
