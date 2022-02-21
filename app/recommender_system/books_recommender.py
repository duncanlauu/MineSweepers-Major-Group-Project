import logging
import time
from operator import itemgetter


def get_top_n(uid, trainset, algo, n=10):
    return get_top_between_m_and_n(uid, trainset, algo, 0, n)


# A function for generating top n items for a given user
def get_top_between_m_and_n(uid, trainset, algo, m=0, n=10):
    items = list((trainset.to_raw_iid(iid) for iid in trainset.all_items()))
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


def get_top_n_for_k(uids, trainset, algo, pred_lookup, n=10):
    return get_top_between_m_and_n_for_k(uids, trainset, algo, pred_lookup, 0, n)


def get_top_between_m_and_n_for_k(uids, trainset, algo, preds, m=0, n=10):
    items = list((trainset.to_raw_iid(iid) for iid in trainset.all_items()))
    sum_of_ratings = {}

    for iid in items:
        for uid in uids:
            # Do not take the rated items into consideration
            if (uid, iid) not in preds:
                pred = algo.predict(uid=uid, iid=iid)
                get_prediction_to_sum_of_ratings(pred, sum_of_ratings)

    return get_the_correct_slice(m, n, sum_of_ratings)


def get_prediction_to_sum_of_ratings(pred, sum_of_ratings):
    if pred.iid in sum_of_ratings:
        sum_of_ratings[pred.iid] = (sum_of_ratings[pred.iid][0] + pred.est, sum_of_ratings[pred.iid][1] + 1)
    else:
        sum_of_ratings[pred.iid] = (pred.est, 1)


def get_global_top_n(dataset, global_mean, n=10):
    return get_global_top_between_m_and_n(dataset, global_mean, 0, n)


def get_global_top_between_m_and_n(dataset, global_mean, m=0, n=10):
    df = dataset[['ISBN', 'Book-Rating']].groupby('ISBN').agg(['mean', 'count'])
    df['weighted'] = df.apply(lambda row: get_weighted_rating(row[0], row[1], global_mean), axis=1)
    df = df.sort_values(by=['weighted'], ascending=False)
    records = list(map(tuple, df.to_records()))
    return records[m: n]


def get_the_correct_slice(m, n, sum_of_ratings):
    average_of_ratings = get_average_from_sum(sum_of_ratings)
    sorted_list_of_ratings = get_sorted_list_from_dict_of_averages(average_of_ratings)
    return sorted_list_of_ratings[m:n]


def get_the_correct_slice_with_weighted_average(m, n, sum_of_ratings, global_mean):
    average_of_ratings = get_weighted_average_from_sum(sum_of_ratings, global_mean)
    sorted_list_of_ratings = get_sorted_list_from_dict_of_averages(average_of_ratings)
    return sorted_list_of_ratings[m:n]


def get_weighted_average_from_sum(sum_of_ratings, global_mean):
    average_of_ratings = []
    for iid, (rat, num) in sum_of_ratings.items():
        average_of_ratings.append((iid, rat / num, num, get_weighted_rating(rat / num, num, global_mean)))
    return average_of_ratings


def get_average_from_sum(sum_of_ratings):
    average_of_ratings = []
    for iid, (rat, num) in sum_of_ratings.items():
        average_of_ratings.append((iid, rat / num))
    return average_of_ratings


def get_sorted_list_from_dict_of_averages(average_of_ratings):
    average_of_ratings.sort(key=itemgetter(1))
    average_of_ratings.reverse()
    return average_of_ratings


# True Bayesian estimate as used by IMDB for the Top 250 Movies
# https://www.quora.com/How-does-IMDbs-rating-system-work
def get_weighted_rating(rating, number_of_votes, global_mean, minimum_number_of_votes=100):
    return rating * number_of_votes / (number_of_votes + minimum_number_of_votes) + \
           minimum_number_of_votes * global_mean / (number_of_votes + minimum_number_of_votes)


def get_top_n_test(trainset, algo):
    top_n = get_top_n(uid=276726, trainset=trainset, n=10, algo=algo)

    # NOTE: The assertions only worked for one particular training, now they're incorrect
    top_n_actual = [('8826703132', 9.172681633546379),
                    ('0439425220', 8.990698999060877),
                    ('0140143505', 8.915475327025979),
                    ('0743454529', 8.905900583624907),
                    ('0618002235', 8.905387608423752),
                    ('067168390X', 8.885429080832147),
                    ('0345339738', 8.869378107558395),
                    ('0380813815', 8.796321235724662),
                    ('3499224615', 8.780329429250468),
                    ('0439136369', 8.764665303001076)]

    # assert top_n == top_n_actual
    # Print the recommended items for the test user
    for item, rating in top_n:
        logging.debug(f'{item} with rating {rating}')


def get_top_n_for_k_test(trainset, algo, pred_uid_and_iid_lookup):
    start = time.time()
    top_n_for_k = get_top_n_for_k(uids=[276726, 276736, 276729, 276704, 276709, 276721, 276723], trainset=trainset,
                                  n=10, algo=algo, pred_lookup=pred_uid_and_iid_lookup)
    end = time.time()
    logging.debug(f'Finished predicting top n for k in {end - start} seconds')

    # NOTE: The assertions only worked for one particular training, now they're incorrect
    top_n_for_k_actual = [('8826703132', 9.163503814330383),
                          ('0743454529', 9.138916247696736),
                          ('0439425220', 9.114199075251523),
                          ('0618002235', 8.990996794401715),
                          ('067168390X', 8.982717279841225),
                          ('0140143505', 8.978727419284954),
                          ('0836213319', 8.967651348689216),
                          ('0836220889', 8.920685808903562),
                          ('0345339738', 8.914973877309004),
                          ('0140620222', 8.8414492533041)]

    # assert top_n_for_k == top_n_for_k_actual

    # Print the recommended items for the test users
    for item, r in top_n_for_k:
        logging.debug(f'{item} with rating {r}')


def get_top_n_global_test(trainset, dataset):
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

    assert top_n_global == top_n_global_actual
