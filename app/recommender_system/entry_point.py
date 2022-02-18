import os

from app.recommender_system.books_recommender import get_top_n_test, get_top_n_for_k_test, get_top_n_global_test
from app.recommender_system.people_recommender import get_top_n_users_test
from app.recommender_system.file_management import *


def recommender_system_tests():
    logging.basicConfig(level=logging.DEBUG)

    # path to dataset file
    file_path = os.path.expanduser('~/.surprise_data/books/BX-Book-Ratings.csv')

    dataframe = get_combined_data(file_path)
    # dataframe = get_dataframe_from_file(file_path)
    data = get_dataset_from_dataframe(dataframe)
    trainset = get_trainset_from_dataset(data)

    # If you've trained the model, keep the lines below commented out
    # You can load instead of rerunning the training.
    # If not, you need to uncomment the following lines: 22-24, 28
    # algo = SVD()
    # train_model(algo, trainset)
    # predictions = fit_model(algo, trainset)

    # Dump algorithm and reload it.
    file_name = os.path.expanduser('~/dump_file')
    # dump_trained_model(file_name, algo, predictions)
    loaded_predictions, loaded_algo = load_trained_model(file_name)

    # logging.debug('original algo prediction')
    # p = algo.predict(uid=276726, iid='0155061224', r_ui=5)
    # logging.debug(f'Pred by original algo uid={p.uid}, iid={p.iid}, r_ui={p.r_ui}, est={p.est}, {p.details}')
    logging.debug('Loaded algo prediction')
    p = loaded_algo.predict(uid=276726, iid='0155061224', r_ui=5)
    logging.debug(f'Pred by loaded algo uid={p.uid}, iid={p.iid}, r_ui={p.r_ui}, est={p.est}, {p.details}')

    predictions_uid_and_iid_lookup = set()
    for prediction in loaded_predictions:
        predictions_uid_and_iid_lookup.add((prediction.uid, prediction.iid))

    get_top_n_test(trainset=trainset, algo=loaded_algo)

    get_top_n_for_k_test(trainset=trainset, algo=loaded_algo,
                         pred_uid_and_iid_lookup=predictions_uid_and_iid_lookup)

    get_top_n_global_test(trainset=trainset, preds=loaded_predictions)

    get_top_n_users_test(trainset=trainset, algo=loaded_algo)


if __name__ == '__main__':
    recommender_system_tests()
