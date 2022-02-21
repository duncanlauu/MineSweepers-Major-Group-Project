import logging
import time
from operator import itemgetter
from random import shuffle

from app.models import User
from app.recommender_system.books_recommender import get_top_n


def get_top_n_users_by_favourite_books(uid, trainset, algo, n=10):
    users = get_actual_users(trainset)
    users.remove(trainset.to_inner_uid(uid))
    users_with_diffs = []

    items = list(x[0] for x in get_top_n(uid, trainset, algo, int(1000000 / len(users))))

    for user in users:
        diff = get_difference_for_two_users(uid1=uid, uid2=user, algo=algo, items=items)
        users_with_diffs.append((user, diff))

    users_with_diffs.sort(key=itemgetter(1))

    return users_with_diffs[0:n]


def get_top_n_users_double_random(uid, trainset, algo, n=10):
    users = get_random_n_users(trainset, 10000)
    if uid in users:
        users.remove(trainset.to_inner_uid(uid))
    users_with_diffs = []

    items = get_random_n_items(trainset, int(1000000 / len(users)))

    for user in users:
        diff = get_difference_for_two_users(uid1=uid, uid2=user, algo=algo, items=items)
        users_with_diffs.append((user, diff))

    users_with_diffs.sort(key=itemgetter(1))

    return users_with_diffs[0:n]


def get_difference_for_two_users(uid1, uid2, algo, items):
    diff = 0
    for iid in items:
        pred1 = algo.predict(uid=uid1, iid=iid)
        pred2 = algo.predict(uid=uid2, iid=iid)
        diff += abs(pred1.est - pred2.est)
    return diff


def get_random_n_items(trainset, n=100):
    items = list(trainset.all_items())
    shuffle(items)
    return items[0:n]


def get_random_n_users(trainset, n=100):
    users = get_actual_users(trainset)
    shuffle(users)
    return users[0:n]


def get_top_n_users_test(algo, trainset):
    start = time.time()
    top_n = get_top_n_users_by_favourite_books(uid=276726, algo=algo, trainset=trainset)
    end = time.time()
    logging.debug(f'Finished getting top n users using favourite books in {end - start} seconds')

    # Print the top 10 users
    for (user, diff) in top_n:
        logging.debug(f'{user} with difference {diff}')

    start = time.time()
    top_n = get_top_n_users_double_random(uid=276726, algo=algo, trainset=trainset)
    end = time.time()
    logging.debug(f'Finished getting top n users using random books and users in {end - start} seconds')

    # Print the top 10 users
    for (user, diff) in top_n:
        logging.debug(f'{user} with difference {diff}')


def get_diff_for_list_of_users(uid1, uids, algo, items):
    diff = 0
    for uid2 in uids:
        for iid in items:
            pred1 = algo.predict(uid=uid1, iid=iid)
            pred2 = algo.predict(uid=uid2, iid=iid)
            diff += abs(pred1.est - pred2.est)
    return diff


def get_best_fitting_n_clubs(uid, algo, trainset, clubs, n=10):
    # For the purpose of this function I assume that clubs is a list of clubs which have ids and users
    items = get_random_n_items(trainset=trainset, n=100000)
    clubs_with_diffs = []
    for club in clubs:
        clubs_with_diffs.append((club.id, get_diff_for_list_of_users(uid, club.members, algo, items)))

    clubs_with_diffs.sort(key=itemgetter(1))
    return clubs_with_diffs[0:n]


def get_actual_users(trainset):
    database_users = [User.objects.all().values()]
    all_trainset_users = trainset.all_users
    return list(set(all_trainset_users).intersection(database_users))
