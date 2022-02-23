"""Functionality for recommending people to people"""

import logging
import time
from operator import itemgetter
from random import shuffle

from app.models import User
from app.recommender_system.books_recommender import get_top_n
from app.recommender_system.genre_algo import get_isbns_for_a_genre


def get_top_n_users_by_favourite_books(uid, trainset, algo, n=10):
    """Get the top n users for a user using favourite books as a measure

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

    return get_top_n_users_for_given_items_and_given_users(algo, items, n, uid, users)


def get_top_n_users_double_random(uid, trainset, algo, n=10):
    """Get the top n users for a user using random users and random items

    The number of books for which we compare the similarity between the users is
    calculated as 100000 / the number of users, because I discovered that a 100000
    comparisons takes a couple of seconds on my computer and we don't want to spend too
    much time doing that

    """

    users = get_actual_users(trainset)
    if uid in users:
        users.remove(trainset.to_inner_uid(uid))
    max_number_of_items = int(100000 / len(users))

    items = get_random_n_items(trainset, max_number_of_items)

    return get_top_n_users_for_given_items_and_given_users(algo, items, n, uid, users)


def get_top_n_users_for_a_genre(uid, trainset, algo, genre, n=10):
    """Get the top n users for a user using items from a given genre

    The number of books for which we compare the similarity between the users is
    calculated as 100000 / the number of users, because I discovered that a 100000
    comparisons takes a couple of seconds on my computer and we don't want to spend too
    much time doing that
    """

    users = get_random_n_users(trainset, 100)
    if uid in users:
        users.remove(trainset.to_inner_uid(uid))
    max_number_of_items = int(100000 / len(users))

    all_items = get_isbns_for_a_genre(genre, trainset)
    items = get_random_n_items_from_a_list(all_items, max_number_of_items)

    return get_top_n_users_for_given_items_and_given_users(algo, items, n, uid, users)


def get_top_n_users_for_given_items_and_given_users(algo, items, n, uid, users):
    """Get top n users for a set of users and a set of items"""
    users_with_diffs = []
    for user in users:
        diff = get_difference_for_two_users(uid1=uid, uid2=user, algo=algo, items=items)
        users_with_diffs.append((user, diff))
    users_with_diffs.sort(key=itemgetter(1))
    return users_with_diffs[0:n]


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

    shuffle(items)
    return items[0:n]


def get_random_n_users(trainset, n=100):
    """Get random n users"""

    users = get_actual_users(trainset)
    shuffle(users)
    return users[0:n]


def get_actual_users(trainset):
    """Get the users from the database for whom we have ratings in the trainset"""

    database_users = (user.id for user in list(User.objects.all()))
    all_trainset_users = trainset.all_users()
    return list(set(all_trainset_users).intersection(database_users))


def get_diff_for_list_of_users(uid1, uids, algo, items):
    """Get the difference between a user and a list of users given a list of items"""

    diff = 0
    for uid2 in uids:
        for iid in items:
            pred1 = algo.predict(uid=uid1, iid=iid)
            pred2 = algo.predict(uid=uid2, iid=iid)
            diff += abs(pred1.est - pred2.est)
    return diff


def get_top_n_users_test(algo, trainset, genre='fiction'):
    """A test for getting top n users for a user

    It runs the following methods
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

    assert top_n == top_n_actual

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


# TODO test this functionality when we have clubs data
def get_best_fitting_n_clubs(uid, algo, trainset, clubs, n=10):
    """Get the top n clubs for a user"""

    # For the purpose of this function I assume that clubs is a list of clubs which have ids and users
    items = get_random_n_items(trainset=trainset, n=100000)
    clubs_with_diffs = []
    for club in clubs:
        clubs_with_diffs.append((club.id, get_diff_for_list_of_users(uid, club.members, algo, items)))

    clubs_with_diffs.sort(key=itemgetter(1))
    return clubs_with_diffs[0:n]
