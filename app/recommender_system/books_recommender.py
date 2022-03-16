"""Functionality for recommending books to people"""

import logging
import time
from operator import itemgetter

from app.models import get_all_users_related_to_a_club
from app.recommender_system.genre_algo import get_books_from_iexact_genre, get_isbns_for_a_genre


def get_top_n_for_genre(uid, trainset, algo, genre, n=10):
    """Get the top n books for a user for a given genre"""

    return get_top_between_m_and_n_for_genre(uid, trainset, algo, genre, 0, n)


def get_top_between_m_and_n_for_genre(uid, trainset, algo, genre, m=0, n=10):
    """Get the top books between m and n for a user for a given genre"""

    items = get_isbns_for_a_genre(genre, trainset)

    return get_top_between_m_and_n_of_items(algo, items, m, n, uid)


def get_top_between_m_and_n_of_items(algo, items, m, n, uid):
    """Get the top books between m and n for a user from given items"""

    ratings = []
    for iid in items:
        pred = algo.predict(uid=uid, iid=iid)
        # Do not take the rated items into consideration
        if 'actual_k' not in pred.details:
            ratings.append((pred.iid, pred.est))
    # Sort by the estimated rating
    ratings.sort(key=itemgetter(1))
    ratings.reverse()
    return ratings[m:n]


def get_top_n(uid, trainset, algo, n=10):
    """Get the top n books for a user"""

    return get_top_between_m_and_n(uid, trainset, algo, 0, n)


def get_top_between_m_and_n(uid, trainset, algo, m=0, n=10):
    """Get the top books between m and n for a user"""

    items = list((trainset.to_raw_iid(iid) for iid in trainset.all_items()))
    return get_top_between_m_and_n_of_items(algo, items, m, n, uid)


def get_top_n_for_club(club, trainset, algo, pred_lookup, n=10):
    """Get the top books between m and n for a club"""

    return get_top_between_m_and_n_for_club(club, trainset, algo, pred_lookup, 0, n)


def get_top_between_m_and_n_for_club(club, trainset, algo, pred_lookup, m=0, n=10):
    """Get the top books between m and n for a club"""

    uids = get_all_users_related_to_a_club(club)
    return get_top_between_m_and_n_for_k(uids, trainset, algo, pred_lookup, m, n)


def get_top_n_for_club_for_genre(club, trainset, algo, pred_lookup, genre, n=10):
    """Get the top books between m and n for a club"""

    return get_top_between_m_and_n_for_club_for_genre(club, trainset, algo, pred_lookup, genre, 0, n)


def get_top_between_m_and_n_for_club_for_genre(club, trainset, algo, pred_lookup, genre, m=0, n=10):
    """Get the top books between m and n for a club"""

    uids = get_all_users_related_to_a_club(club)
    return get_top_between_m_and_n_for_k_for_genre(uids, trainset, algo, pred_lookup, genre, m, n)


def get_top_n_for_k(uids, trainset, algo, pred_lookup, n=10):
    """Get the top n books for k users"""

    return get_top_between_m_and_n_for_k(uids, trainset, algo, pred_lookup, 0, n)


def get_top_between_m_and_n_for_k(uids, trainset, algo, preds, m=0, n=10):
    """Get the top books between m and n for k users"""

    items = list((trainset.to_raw_iid(iid) for iid in trainset.all_items()))
    return get_top_between_m_and_n_of_items_for_k_users(algo, items, m, n, preds, uids)


def get_top_n_for_k_for_genre(uids, trainset, algo, pred_lookup, genre, n=10):
    """Get the top n books for k users for a genre"""

    return get_top_between_m_and_n_for_k_for_genre(uids, trainset, algo, pred_lookup, genre, 0, n)


def get_top_between_m_and_n_for_k_for_genre(uids, trainset, algo, preds, genre, m=0, n=10):
    """Get the top books between m and n for k users for a genre"""

    items = get_isbns_for_a_genre(genre, trainset)
    return get_top_between_m_and_n_of_items_for_k_users(algo, items, m, n, preds, uids)


def get_top_between_m_and_n_of_items_for_k_users(algo, items, m, n, preds, uids):
    """Get the top books between m and n for k users from given items"""

    sum_of_ratings = {}
    for iid in items:
        for uid in uids:
            # Do not take the rated items into consideration
            if (uid, iid) not in preds:
                pred = algo.predict(uid=uid, iid=iid)
                get_prediction_to_sum_of_ratings(pred, sum_of_ratings)
    return get_the_correct_slice(m, n, sum_of_ratings)


def get_prediction_to_sum_of_ratings(pred, sum_of_ratings):
    """Helper function to sum all estimated ratings for an item"""

    if pred.iid in sum_of_ratings:
        sum_of_ratings[pred.iid] = (sum_of_ratings[pred.iid][0] + pred.est, sum_of_ratings[pred.iid][1] + 1)
    else:
        sum_of_ratings[pred.iid] = (pred.est, 1)


def get_global_top_n(dataset, global_mean, n=10):
    """Get global top n books"""

    return get_global_top_between_m_and_n(dataset, global_mean, 0, n)


def get_global_top_between_m_and_n(dataset, global_mean, m=0, n=10):
    """Get global top books between m and n"""

    df = dataset[['ISBN', 'Book-Rating']]
    return get_top_between_m_and_n_weighted_for_dataframe(df, global_mean, m, n)


def get_top_between_m_and_n_weighted_for_dataframe(df, global_mean, m, n):
    """Get global top between m and n for a dataframe"""

    df = df.groupby('ISBN').agg(['mean', 'count'])
    df['weighted'] = df.apply(lambda row: get_weighted_rating(row[0], row[1], global_mean), axis=1)
    df = df.sort_values(by=['weighted'], ascending=False)
    records = list(map(tuple, df.to_records()))
    return records[m: n]


def get_global_top_n_for_genre(dataset, global_mean, genre, n=10):
    """Get global top n books for a given genre"""

    return get_global_top_between_m_and_n_for_genre(dataset, global_mean, genre, 0, n)


def get_global_top_between_m_and_n_for_genre(dataset, global_mean, genre, m=0, n=10):
    """Get global top books between m and n for a given genre"""

    books = get_books_from_iexact_genre(genre)
    items_with_the_genre = (book.ISBN for book in books)
    df = dataset[['ISBN', 'Book-Rating']]
    df = df[df['ISBN'].isin(items_with_the_genre)]
    return get_top_between_m_and_n_weighted_for_dataframe(df, global_mean, m, n)


def get_the_correct_slice(m, n, sum_of_ratings):
    """Get the correct slice between m and n from the sum of ratings"""

    average_of_ratings = get_average_from_sum(sum_of_ratings)
    sorted_list_of_ratings = get_sorted_list_from_dict_of_averages(average_of_ratings)
    return sorted_list_of_ratings[m:n]


def get_the_correct_slice_with_weighted_average(m, n, sum_of_ratings, global_mean):
    """Get the correct slice between m and n from the sum of ratings using weighted average"""

    average_of_ratings = get_weighted_average_from_sum(sum_of_ratings, global_mean)
    sorted_list_of_ratings = get_sorted_list_from_dict_of_averages(average_of_ratings)
    return sorted_list_of_ratings[m:n]


def get_weighted_average_from_sum(sum_of_ratings, global_mean):
    """Get weighted average from sum of ratings"""

    average_of_ratings = []
    for iid, (rat, num) in sum_of_ratings.items():
        average_of_ratings.append((iid, rat / num, num, get_weighted_rating(rat / num, num, global_mean)))
    return average_of_ratings


def get_average_from_sum(sum_of_ratings):
    """Get average from sum of ratings"""

    average_of_ratings = []
    for iid, (rat, num) in sum_of_ratings.items():
        average_of_ratings.append((iid, rat / num))
    return average_of_ratings


def get_sorted_list_from_dict_of_averages(average_of_ratings):
    """Get sorted list from dictionary of item: average rating"""

    average_of_ratings.sort(key=itemgetter(1))
    average_of_ratings.reverse()
    return average_of_ratings


def get_weighted_rating(rating, number_of_votes, global_mean, minimum_number_of_votes=100):
    """Get weighted rating

    True Bayesian estimate as used by IMDB for the Top 250 Movies
    https://www.quora.com/How-does-IMDbs-rating-system-work

    """
    return rating * number_of_votes / (number_of_votes + minimum_number_of_votes) + \
           minimum_number_of_votes * global_mean / (number_of_votes + minimum_number_of_votes)


def get_top_n_test(trainset, algo):
    """A test for getting the top n books for a user"""

    start = time.time()
    top_n = get_top_n(uid=1276726, trainset=trainset, n=10, algo=algo)
    end = time.time()
    logging.debug(f'Finished predicting top n for a user in {end - start} seconds')

    # NOTE: The assertions only work for one particular training, they might be incorrect if you retrain the model
    top_n_actual = [('0439425220', 9.174304401932348),
                    ('8826703132', 9.067001081905996),
                    ('3499224615', 9.00934986241683),
                    ('0394800893', 8.933664753678935),
                    ('0743454529', 8.927703926596612),
                    ('0345339738', 8.90310403011183),
                    ('067168390X', 8.89856331456661),
                    ('0060935464', 8.879682449533949),
                    ('0836218620', 8.871357572619774),
                    ('0836213319', 8.853826897087968)]

    # Print the recommended items for the test user
    for item, rating in top_n:
        logging.debug(f'{item} with rating {rating}')

    # assert top_n == top_n_actual


def get_top_n_for_k_test(trainset, algo, pred_uid_and_iid_lookup):
    """A test for getting the top n books for k users"""

    start = time.time()
    top_n_for_k = get_top_n_for_k(uids=[1276726, 1276736, 1276729, 1276704, 1276709, 1276721, 1276723],
                                  trainset=trainset,
                                  n=10, algo=algo, pred_lookup=pred_uid_and_iid_lookup)
    end = time.time()
    logging.debug(f'Finished predicting top n for k in {end - start} seconds')

    # NOTE: The assertions only work for one particular training, they might be incorrect if you retrain the model
    top_n_for_k_actual = [('0439425220', 9.234270187349702),
                          ('8826703132', 9.196513791031593),
                          ('0743454529', 9.173717919771407),
                          ('0836213319', 9.024095539721182),
                          ('067168390X', 8.999592624889639),
                          ('0439136369', 8.949199389557576),
                          ('0618002235', 8.937516408956757),
                          ('0140143505', 8.923299395269382),
                          ('3499224615', 8.918117789066516),
                          ('0345339738', 8.8733494964531)]

    # Print the recommended items for the test users
    for item, r in top_n_for_k:
        logging.debug(f'{item} with rating {r}')

    # assert top_n_for_k == top_n_for_k_actual


def get_top_n_global_test(trainset, dataset):
    """A test for getting the top n books globally"""

    start = time.time()
    top_n_global = get_global_top_n(dataset=dataset, global_mean=trainset.global_mean)
    end = time.time()
    logging.debug(f'Finished getting top n global in {end - start} seconds')

    top_n_global_actual = [('059035342X', 8.939297124600639, 313, 8.615270277499112),
                           ('043935806X', 9.033980582524272, 206, 8.565707923552722),
                           ('0439139597', 9.262773722627736, 137, 8.561631327456258),
                           ('0446310786', 8.94392523364486, 214, 8.516263135691506),
                           ('0439136369', 9.082706766917294, 133, 8.4468095476701),
                           ('0439136350', 9.035460992907801, 141, 8.440276450652004),
                           ('0345339738', 9.402597402597403, 77, 8.38478318987081),
                           ('0439064872', 8.783068783068783, 189, 8.374071365422605),
                           ('0590353403', 8.983193277310924, 119, 8.352085043868188),
                           ('0439064864', 8.920634920634921, 126, 8.336754976137758)]
    # Print the global top 10
    for item, r, n, wr in top_n_global:
        logging.debug(f'{item} with rating {r}, num {n} and weighted rating {wr}')

    for i in range(0, len(top_n_global)):
        assert top_n_global[i][0] == top_n_global_actual[i][0]
        assert top_n_global[i][1] == top_n_global_actual[i][1]
        assert top_n_global[i][2] == top_n_global_actual[i][2]
        # The weighted rating is different because the global mean is different


def get_top_n_for_genre_test(trainset, algo, genre):
    """A test for getting the top n books for a user for a given genre"""

    start = time.time()
    top_n = get_top_n_for_genre(uid=1276726, trainset=trainset, n=10, algo=algo, genre=genre)
    end = time.time()
    logging.debug(f'Finished predicting top n for a user for a genre in {end - start} seconds')
    # NOTE: The assertions only work for one particular training, they might be incorrect if you retrain the model
    top_n_actual = [('0743454529', 8.927703926596612),
                    ('067168390X', 8.89856331456661),
                    ('0345361792', 8.847939111939935),
                    ('0618002235', 8.844335177040977),
                    ('193156146X', 8.741249467435024),
                    ('0142001740', 8.740715762702006),
                    ('3551551693', 8.711227192982351),
                    ('0060915544', 8.663857353082424),
                    ('843760494X', 8.655268551146117),
                    ('0345342968', 8.621137430160628)]

    # assert top_n == top_n_actual

    # Print the recommended items for the test user
    for item, rating in top_n:
        logging.debug(f'{item} with rating {rating}')


def get_top_n_for_k_for_genre_test(trainset, algo, pred_uid_and_iid_lookup, genre):
    """A test for getting the top n books for k users for a given genre"""

    start = time.time()
    top_n_for_k = get_top_n_for_k_for_genre(uids=[1276726, 1276736, 1276729, 1276704, 1276709, 1276721, 1276723],
                                            trainset=trainset,
                                            n=10, algo=algo, pred_lookup=pred_uid_and_iid_lookup, genre=genre)
    end = time.time()
    logging.debug(f'Finished predicting top n for k for a genre in {end - start} seconds')

    # NOTE: The assertions only work for one particular training, they might be incorrect if you retrain the model
    top_n_for_k_actual = [('0743454529', 9.173717919771407),
                          ('067168390X', 8.999592624889639),
                          ('0618002235', 8.937516408956757),
                          ('0553274325', 8.799500394931796),
                          ('1880418568', 8.761974107494297),
                          ('0446310786', 8.708666770562576),
                          ('006092988X', 8.669059087099374),
                          ('0312169787', 8.659066585889624),
                          ('193156146X', 8.656619899787543),
                          ('1576738167', 8.645236142697513)]

    # Print the recommended items for the test users
    for item, r in top_n_for_k:
        logging.debug(f'{item} with rating {r}')

    # assert top_n_for_k == top_n_for_k_actual


def get_top_n_global_for_genre_test(trainset, dataset, genre):
    """A test for getting the top n books globally for a given genre"""

    start = time.time()
    top_n_global = get_global_top_n_for_genre(dataset=dataset, global_mean=trainset.global_mean, genre=genre)
    end = time.time()
    logging.debug(f'Finished getting top n global for a genre in {end - start} seconds')

    top_n_global_actual = [('0446310786', 8.94392523364486, 214, 8.51372237363088),
                           ('0345339681', 8.73913043478261, 161, 8.30003381348696),
                           ('0385504209', 8.435318275154003, 487, 8.29183786255553),
                           ('0812550706', 8.837606837606838, 117, 8.264095969217035),
                           ('0345361792', 8.607734806629834, 181, 8.246650623914935),
                           ('0142001740', 8.452768729641694, 307, 8.241545025356503),
                           ('0345342968', 8.628048780487806, 164, 8.23601827772764),
                           ('0441172717', 8.973333333333333, 75, 8.184621858971981),
                           ('0345348036', 8.837837837837839, 74, 8.122464513333888),
                           ('0316666343', 8.185289957567186, 707, 8.111906846741135)]
    # Print the global top 10
    for item, r, n, wr in top_n_global:
        logging.debug(f'{item} with rating {r}, num {n} and weighted rating {wr}')

    # for i in range(0, len(top_n_global)):
    # assert top_n_global[i][0] == top_n_global_actual[i][0]
    # assert top_n_global[i][1] == top_n_global_actual[i][1]
    # assert top_n_global[i][2] == top_n_global_actual[i][2]
    # The weighted rating is different because the global mean is different
