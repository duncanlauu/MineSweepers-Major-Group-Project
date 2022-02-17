import os
import time

from pandas import read_csv
from surprise import Reader, Dataset, SVD
from surprise.dump import load, dump

from books_recommender import get_top_n_test, get_top_n_for_k_test, get_top_n_global_test
from people_recommender import get_top_n_users_test

if __name__ == '__main__':
    # path to dataset file
    file_path = os.path.expanduser('~/.surprise_data/books/BX-Book-Ratings.csv')

    # Read the data from the csv (remember about the encoding used)
    my_data = read_csv(file_path, sep=';', encoding='unicode_escape')
    # Filter out the 0s (We think 0 means no rating given)
    my_data = my_data[my_data['Book-Rating'] != 0]
    print(my_data)

    reader = Reader(rating_scale=(1, 10))

    data = Dataset.load_from_df(my_data[['User-ID', 'ISBN', 'Book-Rating']], reader)
    trainset = data.build_full_trainset()

    print('Number of users: ', trainset.n_users, '\n')
    print('Number of items: ', trainset.n_items, '\n')

    # If you've trained the model, keep the lines below commented out
    # You can load instead of rerunning the training.
    algo = SVD()

    start = time.time()
    algo.fit(trainset)
    predictions = algo.test(trainset.build_testset())
    end = time.time()
    print(f'Finished fitting in {end - start} seconds')

    # Dump algorithm and reload it.
    file_name = os.path.expanduser('~/dump_file')
    dump(file_name, predictions=predictions, algo=algo)
    loaded_predictions, loaded_algo = load(file_name)

    # print('original algo prediction')
    # algo.predict(uid=276726, iid='0155061224', r_ui=5, verbose=True)
    print('loaded algo prediction')
    loaded_algo.predict(uid=276726, iid='0155061224', r_ui=5, verbose=True)

    predictions_uid_and_iid_lookup = set()
    for prediction in loaded_predictions:
        predictions_uid_and_iid_lookup.add((prediction.uid, prediction.iid))

    get_top_n_test(trainset=trainset, algo=loaded_algo)

    get_top_n_for_k_test(trainset=trainset, algo=loaded_algo, pred_uid_and_iid_lookup=predictions_uid_and_iid_lookup)

    get_top_n_global_test(trainset=trainset, preds=loaded_predictions)

    get_top_n_users_test(trainset=trainset, algo=loaded_algo)
