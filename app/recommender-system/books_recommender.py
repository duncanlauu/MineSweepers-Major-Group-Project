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


def get_global_top_between_m_and_n(preds, c, m=0, n=10):
    sum_of_ratings = {}
    for pred in preds:
        get_prediction_to_sum_of_ratings(pred, sum_of_ratings)

    return get_the_correct_slice_with_weighted_average(m, n, sum_of_ratings, c)


def get_global_top_n(preds, global_mean, n=10):
    return get_global_top_between_m_and_n(preds, global_mean, 0, n)


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
        average_of_ratings.append((iid, (get_weighted_rating(rat, num, global_mean), rat / num, num)))
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
# r is rating, num is the number of votes, m is the minimum number of votes and c is the global mean
# https://www.quora.com/How-does-IMDbs-rating-system-work
def get_weighted_rating(rating, number_of_votes, global_mean, minimum_number_of_votes=100):
    return rating / (number_of_votes + minimum_number_of_votes) + minimum_number_of_votes * global_mean / (
            number_of_votes + minimum_number_of_votes)


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
        print(f'{item} with rating {rating}')


def get_top_n_for_k_test(trainset, algo, pred_uid_and_iid_lookup):
    start = time.time()
    top_n_for_k = get_top_n_for_k(uids=[276726, 276736, 276729, 276704, 276709, 276721, 276723], trainset=trainset,
                                  n=10, algo=algo, pred_lookup=pred_uid_and_iid_lookup)
    end = time.time()
    print(end - start)

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
        print(f'{item} with rating {r}')


def get_top_n_global_test(trainset, preds):
    start = time.time()
    top_n_global = get_global_top_n(preds=preds, global_mean=trainset.global_mean)
    end = time.time()
    print(end - start)

    # NOTE: The assertions only worked for one particular training, now they're incorrect
    top_n_global_actual = [('059035342X', (8.576249337877952, 8.887809431106904, 313)),
                           ('043935806X', (8.529369544084746, 8.980002213023297, 206)),
                           ('0439139597', (8.508138723705766, 9.170235422709002, 137)),
                           ('0446310786', (8.49070836411972, 8.906428980030183, 214)),
                           ('0439136350', (8.418126255853283, 8.997601440095801, 141)),
                           ('0439136369', (8.415772747581926, 9.028334026913198, 133)),
                           ('0345339738', (8.352494625103933, 9.328375636834584, 77)),
                           ('0439064872', (8.346898555398766, 8.741518824884182, 189)),
                           ('0590353403', (8.331892923582547, 8.946032988718024, 119)),
                           ('0439064864', (8.318261314030325, 8.887463748918416, 126))]
    # Print the global top 10
    for item, (wr, r, n) in top_n_global:
        print(f'{item} with weighted rating {wr}, rating {r} and num {n}')

    # assert top_n_global == top_n_global_actual
