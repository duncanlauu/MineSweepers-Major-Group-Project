from app.models import Club
from app.recommender_system.people_recommender import get_actual_users, \
    get_top_between_m_and_n_users_for_given_items_and_given_users, get_top_between_m_and_n_clubs_for_items


def get_top_between_m_and_n_users_for_search(search_user, search_books, trainset, algo, m=0, n=10):
    """Get the top n users using the search books"""

    users = get_actual_users(trainset)
    books = list(search_books)
    books.append(search_user.liked_books())
    items = list((book.isbn for book in books))
    return get_top_between_m_and_n_users_for_given_items_and_given_users(algo, items, m, n, search_user, users)


def get_top_n_users_for_search(search_user, search_books, trainset, algo, n=10):
    """Get the top n users using the search books"""

    return get_top_between_m_and_n_users_for_search(search_user, search_books, trainset, algo, 0, n)


def get_top_between_m_and_n_clubs_for_search(search_user, search_books, search_clubs, algo, m=0, n=10):
    """Get the top n clubs using the search books"""

    books = list(search_books)
    books.append(search_user.liked_books())
    items = list((book.isbn for book in books))
    clubs = list(set(Club.objects.all()).difference(search_clubs))
    return get_top_between_m_and_n_clubs_for_items(algo, clubs, items, m, n, search_user)


def get_top_n_clubs_for_search(search_user, search_books, search_clubs, algo, n=10):
    """Get the top n clubs using the search books"""

    return get_top_between_m_and_n_clubs_for_search(search_user, search_books, search_clubs, algo, 0, n)