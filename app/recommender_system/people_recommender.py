"""Functionality for recommending people to people"""

import logging
import time
from operator import itemgetter
from random import shuffle, seed

from app.models import User, Club
from app.recommender_system.books_recommender import get_top_n
from app.recommender_system.file_management import get_all_related_users
from app.recommender_system.genre_algo import get_isbns_for_a_genre


def get_top_between_m_and_n_users_by_favourite_books(uid, trainset, algo, m=0, n=10):
    """
    Get the top between m and n users for a user using favourite books as a measure

    The number of books for which we compare the similarity between the users is
    calculated as 100000 / the number of users, because I discovered that a 100000
    comparisons takes about 1 second on my computer and we don't want to spend too
    much time doing that

    """

    users = get_actual_users(trainset)
    if trainset.to_inner_uid(uid) in users:
        users.remove(trainset.to_inner_uid(uid))
    max_number_of_items = int(100000 / len(users))

    items = list(x[0] for x in get_top_n(uid, trainset, algo, max_number_of_items))

    return get_top_between_m_and_n_users_for_given_items_and_given_users(algo, items, m, n, uid, users)


def get_top_n_users_by_favourite_books(uid, trainset, algo, n=10):
    """Get the top n users for a user using favourite books as a measure"""

    return get_top_between_m_and_n_users_by_favourite_books(uid, trainset, algo, 0, n)


def get_top_between_m_and_n_users_double_random(uid, trainset, algo, m, n=10):
    """Get the top between m and n users for a user using random users and random items"""

    users = get_actual_users(trainset)
    if trainset.to_inner_uid(uid) in users:
        users.remove(trainset.to_inner_uid(uid))
    max_number_of_items = int(100000 / len(users))

    items = get_random_n_items(trainset, max_number_of_items)

    return get_top_between_m_and_n_users_for_given_items_and_given_users(algo, items, m, n, uid, users)


def get_top_n_users_double_random(uid, trainset, algo, n=10):
    """Get the top users for a user using random users and random items"""

    return get_top_between_m_and_n_users_double_random(uid, trainset, algo, 0, n)


def get_top_between_m_and_n_users_for_a_genre(uid, trainset, algo, genre, m, n=10):
    """Get the top between m and n users for a user using items from a given genre"""

    users = get_random_n_users(trainset, 100)
    if uid in users:
        users.remove(trainset.to_inner_uid(uid))
    max_number_of_items = int(100000 / len(users))

    all_items = get_isbns_for_a_genre(genre, trainset)
    items = get_random_n_items_from_a_list(all_items, max_number_of_items)

    return get_top_between_m_and_n_users_for_given_items_and_given_users(algo, items, m, n, uid, users)


def get_top_n_users_for_a_genre(uid, trainset, algo, genre, n=10):
    """Get the top n users for a user using items from a given genre"""

    return get_top_between_m_and_n_users_for_a_genre(uid, trainset, algo, genre, 0, n)


def get_top_between_m_and_n_users_for_given_items_and_given_users(algo, items, m, n, uid, users):
    """Get top between m and n users for a set of users and a set of items"""

    users_with_diffs = []
    for user in users:
        diff = get_difference_for_two_users(uid1=uid, uid2=user, algo=algo, items=items)
        users_with_diffs.append((user, diff))
    users_with_diffs.sort(key=itemgetter(1))
    return users_with_diffs[m:n]


def get_top_n_users_for_given_items_and_given_users(algo, items, n, uid, users):
    """Get top n users for a set of users and a set of items"""

    return get_top_between_m_and_n_users_for_given_items_and_given_users(algo, items, 0, n, uid, users)


def get_difference_for_two_users(uid1, uid2, algo, items):
    """Get the difference for two users on a given items list"""

    diff = 0
    for iid in items:
        pred1 = algo.predict(uid=uid1, iid=iid)
        pred2 = algo.predict(uid=uid2, iid=iid)
        diff += abs(pred1.est - pred2.est)
    return diff


def get_random_n_items(trainset, n=100):
    """Get random n items"""

    items = list(trainset.all_items())
    return get_random_n_items_from_a_list(items, n)


def get_random_n_items_from_a_list(items, n):
    """Get random n items from a list"""

    # To be able to test it, I seed with the same number each time
    seed(10)
    shuffle(items)
    return items[0:n]


def get_random_n_users(trainset, n=100):
    """Get random n users"""

    users = get_actual_users(trainset)
    # To be able to test it, I seed with the same number each time
    seed(10)
    shuffle(users)
    return users[0:n]


def get_actual_users(trainset):
    """Get the users from the database for whom we have ratings in the trainset"""

    database_users = (user.id for user in list(User.objects.all()))
    all_trainset_users = trainset.all_users()
    return list(set(all_trainset_users).intersection(database_users))


def get_average_diff_for_list_of_users(uid1, uids, algo, items):
    """Get the average difference between a user and a list of users given a list of items"""

    if not items:
        return -1
    diff = 0
    for uid2 in uids:
        for iid in items:
            pred1 = algo.predict(uid=uid1, iid=iid)
            pred2 = algo.predict(uid=uid2, iid=iid)
            diff += abs(pred1.est - pred2.est)
    return diff / (len(items))


def get_top_between_m_and_n_clubs_using_random_items(uid, algo, trainset, clubs, m, n=10):
    """Get the top between m and n clubs for a user using random items"""

    num_of_users = 0
    for club in clubs:
        num_of_users += len(get_all_related_users(club))

    items = get_random_n_items(trainset, int(100000 / num_of_users))

    return get_top_between_m_and_n_clubs_for_items(algo, clubs, items, m, n, uid)


def get_top_n_clubs_using_random_items(uid, algo, trainset, clubs, n=10):
    """Get the top n clubs for a user using random items"""

    return get_top_between_m_and_n_clubs_using_random_items(uid, algo, trainset, clubs, 0, n)


def get_top_between_m_and_n_clubs_using_top_items_for_a_user(uid, algo, trainset, clubs, m, n=10):
    """Get the top between m and n clubs for a user using user's top books"""

    num_of_users = 0
    for club in clubs:
        num_of_users += len(get_all_related_users(club))

    max_number_of_items = int(100000 / num_of_users)
    items = list(x[0] for x in get_top_n(uid, trainset, algo, max_number_of_items))

    return get_top_between_m_and_n_clubs_for_items(algo, clubs, items, m, n, uid)


def get_top_n_clubs_using_top_items_for_a_user(uid, algo, trainset, clubs, n=10):
    """Get the top n clubs for a user using user's top books"""

    return get_top_between_m_and_n_clubs_using_top_items_for_a_user(uid, algo, trainset, clubs, 0, n)


def get_top_between_m_and_n_clubs_for_a_genre(uid, algo, trainset, clubs, genre, m, n=10):
    """Get the top between m and n clubs for a user using random books from a genre"""

    num_of_users = 0
    for club in clubs:
        num_of_users += len(get_all_related_users(club))

    max_number_of_items = int(100000 / num_of_users)
    all_items = get_isbns_for_a_genre(genre, trainset)
    items = get_random_n_items_from_a_list(all_items, max_number_of_items)

    return get_top_between_m_and_n_clubs_for_items(algo, clubs, items, m, n, uid)


def get_top_n_clubs_for_a_genre(uid, algo, trainset, clubs, genre, n=10):
    """Get the top n clubs for a user using random books from a genre"""

    return get_top_between_m_and_n_clubs_for_a_genre(uid, algo, trainset, clubs, genre, 0, n)


def get_top_between_m_and_n_clubs_using_clubs_books(uid, algo, clubs, m, n=10):
    """Get the top between m and n clubs for a user using the club's books"""

    clubs_with_diffs = []
    for club in clubs:
        uids = list((user.id for user in get_all_related_users(club)))
        items = list((book.ISBN for book in club.books.all()))
        clubs_with_diffs.append((club.id, get_average_diff_for_list_of_users(uid, uids, algo, items)))
    clubs_with_diffs.sort(key=itemgetter(1))
    return clubs_with_diffs[m:n]


def get_top_n_clubs_using_clubs_books(uid, algo, clubs, n=10):
    """Get the top n clubs for a user using the club's books"""

    return get_top_between_m_and_n_clubs_using_clubs_books(uid, algo, clubs, 0, n)


def get_top_between_m_and_n_clubs_for_items(algo, clubs, items, m, n, uid):
    """Get the top between m and n clubs for a user for a list of items"""

    clubs_with_diffs = []
    for club in clubs:
        uids = list((user.id for user in get_all_related_users(club)))
        clubs_with_diffs.append((club.id, get_average_diff_for_list_of_users(uid, uids, algo, items)))
    clubs_with_diffs.sort(key=itemgetter(1))
    return clubs_with_diffs[m:n]


def get_top_n_users_test(algo, trainset, genre='fiction'):
    """
    A test for getting top n users for a user

    It runs the following functions
    get_top_n_users_by_favourite_books, get_top_n_users_double_random

    """

    start = time.time()
    top_n = get_top_n_users_by_favourite_books(uid=1276726, algo=algo, trainset=trainset)
    end = time.time()
    logging.debug(f'Finished getting top n users using favourite books in {end - start} seconds')

    # NOTE: The assertions only work for one particular training, they might be incorrect if you retrain the model
    top_n_actual = [(334, 116.88831650788215),
                    (295, 118.31907524126018),
                    (230, 121.51060517962556),
                    (293, 124.20817889349061),
                    (330, 124.50022665248169),
                    (353, 144.86118662058908),
                    (317, 147.43585085788217),
                    (238, 161.26199843032222),
                    (309, 163.22160539275706),
                    (228, 164.6446862996973)]

    # assert top_n == top_n_actual

    # Print the top 10 users
    for (user, diff) in top_n:
        logging.debug(f'{user} with difference {diff}')

    start = time.time()
    top_n = get_top_n_users_double_random(uid=276726, algo=algo, trainset=trainset)
    end = time.time()
    logging.debug(f'Finished getting top n users using random books and users in {end - start} seconds')

    # NOTE: The item choice and the user choice are random so I cannot write any tests for it

    # Print the top 10 users
    for (user, diff) in top_n:
        logging.debug(f'{user} with difference {diff}')

    start = time.time()
    top_n = get_top_n_users_for_a_genre(uid=1276726, algo=algo, trainset=trainset, genre=genre)
    end = time.time()
    logging.debug(f'Finished getting top n users for a genre in {end - start} seconds')

    # NOTE: The item choice is random so I cannot write any tests for it

    # Print the top 10 users
    for (user, diff) in top_n:
        logging.debug(f'{user} with difference {diff}')


def get_top_n_clubs_test(algo, trainset, genre):
    """
    A test for getting top n clubs for a user

    It runs the following functions
    get_top_n_clubs_using_random_items, get_top_n_clubs_using_top_items_for_a_user, get_top_n_clubs_for_a_genre

    """

    start = time.time()
    top_n = get_top_n_clubs_using_random_items(uid=1276726, algo=algo, trainset=trainset,
                                               clubs=list(Club.objects.all()))
    end = time.time()
    logging.debug(f'Finished getting top n clubs with random items in {end - start} seconds')

    # NOTE: The item choice is random so I cannot write any tests for it

    # Print the top 10 clubs
    for (club, diff) in top_n:
        logging.debug(f'{club} with difference {diff}')

    start = time.time()
    top_n = get_top_n_clubs_using_top_items_for_a_user(uid=1276726, algo=algo, trainset=trainset,
                                                       clubs=list(Club.objects.all()))
    end = time.time()
    logging.debug(f'Finished getting top n clubs with top items in {end - start} seconds')

    # NOTE: The assertions only work for one particular training, they might be incorrect if you retrain the model
    top_n_actual = [(6, 3.505534454684893),
                    (9, 4.143084212012058),
                    (10, 7.717597523564549),
                    (14, 8.926585442235737),
                    (13, 9.659160285675167),
                    (1, 11.5182567703274),
                    (2, 14.328265973238327),
                    (11, 15.595305319348453),
                    (3, 15.756530867111913),
                    (8, 16.746178006115013)]

    # assert top_n == top_n_actual

    # Print the top 10 clubs
    for (club, diff) in top_n:
        logging.debug(f'{club} with difference {diff}')

    start = time.time()
    top_n = get_top_n_clubs_for_a_genre(uid=1276726, algo=algo, trainset=trainset,
                                        clubs=list(Club.objects.all()), genre=genre)
    end = time.time()
    logging.debug(f'Finished getting top n clubs with random items for a given genre in {end - start} seconds')

    # NOTE: The item choice is random so I cannot write any tests for it

    # Print the top 10 clubs
    for (club, diff) in top_n:
        logging.debug(f'{club} with difference {diff}')

    start = time.time()
    top_n = get_top_n_clubs_using_clubs_books(uid=1276726, algo=algo,
                                              clubs=list(Club.objects.all()))
    end = time.time()
    logging.debug(f'Finished getting top n clubs with club\'s items in {end - start} seconds')

    # NOTE: The assertions only work for one particular training, they might be incorrect if you retrain the model
    top_n_actual = [(6, 3.2331997259111755),
                    (9, 3.4104444156455855),
                    (10, 6.998403692160351),
                    (14, 8.04901214823293),
                    (13, 8.677910865192112),
                    (1, 9.915907208303397),
                    (2, 12.151868348701255),
                    (3, 12.977574592245945),
                    (11, 13.9265376783672),
                    (8, 14.696792659494873)]

    # assert top_n == top_n_actual

    # Print the top 10 clubs
    for (club, diff) in top_n:
        logging.debug(f'{club} with difference {diff}')
