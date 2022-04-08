"""
The entry point script for testing the recommender system

It loads the model and runs some tests

"""
from surprise import SVD

import boto3
import os

from app.models import User
from app.recommender_system.books_recommender import get_top_n_test, get_top_n_for_k_test, get_top_n_global_test, \
    get_top_n_for_genre_test, get_top_n_for_k_for_genre_test, get_top_n_global_for_genre_test
from app.recommender_system.people_recommender import get_top_n_users_test, get_top_n_clubs_test
from app.recommender_system.file_management import *


def recommender_system_tests():
    """
    Run all the tests for the recommending system

    First load the trained model, then run
    get_top_n_test, get_top_n_for_k_test, get_top_n_global_test and get_top_n_users_test

    """

    logging.basicConfig(level=logging.DEBUG)

    # path to dataset file
    file_path = 'app/files/BX-Book-Ratings.csv'
    filtered_file_path = 'app/files/BX-Book-Ratings-filtered.csv'

    start = time.time()
    dataframe = get_combined_data(file_path, False)
    end = time.time()
    print(end - start)

    dataframe = dataframe.sort_values('User-ID')
    dataframe = dataframe.reset_index(drop=True)

    file_dataframe = get_dataframe_from_file(file_path)
    file_dataframe.to_csv(index=False, path_or_buf=filtered_file_path)

    start = time.time()
    dataframe2 = get_combined_data(filtered_file_path)
    end = time.time()
    print(end - start)

    dataframe2 = dataframe2.sort_values('User-ID')
    dataframe2 = dataframe2.reset_index(drop=True)

    print(dataframe)
    print(dataframe2)

    print(dataframe.equals(dataframe2))

    data = get_dataset_from_dataframe(dataframe)
    trainset = get_trainset_from_dataset(data)

    # If you've trained the model, keep the lines below commented out
    # You can load instead of rerunning the training.
    # If not, you need to uncomment the following 3 lines and the line calling dump_trained_model
    algo = SVD()
    train_model(algo, trainset)
    predictions = test_model(algo, trainset)

    print(os.environ.get('AWS_ACCESS_KEY_ID', None))
    print(os.environ.get('AWS_SECRET_ACCESS_KEY', None))
    print(os.environ.get('S3_BUCKET_NAME', None))

    # Dump algorithm and reload it.
    file_name = 'app/files/dump_file'
    # dump_trained_model(file_name, algo, predictions)
    # loaded_predictions, loaded_algo = load_trained_model(file_name)


    s3 = boto3.client('s3',
                  aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID', None),
                  aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY', None), )

    # s3.upload_file(file_name, os.environ.get('S3_BUCKET_NAME', None),
    #     '%s/%s' % ('app/files', 'dump_file'))

    # print("Uploaded to S3")

    # Download file from S3
    s3.download_file(os.environ.get('S3_BUCKET_NAME', None), 'app/files/dump_file',
         'app/files/dump_file')

    print("Downloaded from S3")

    loaded_predictions, loaded_algo = load_trained_model(file_name)



    uid = User.objects.get(username='Jeb').pk
    uids = (user.id for user in Club.objects.get(name='Kerbal book club').members.all())

    # logging.debug('original algo prediction')
    # p = algo.predict(uid=1276726, iid='0155061224', r_ui=5)
    # logging.debug(f'Pred by original algo uid={p.uid}, iid={p.iid}, r_ui={p.r_ui}, est={p.est}, {p.details}')
    logging.debug('Loaded algo prediction')
    p = loaded_algo.predict(uid=uid, iid='0155061224', r_ui=5)
    logging.debug(f'Pred by loaded algo uid={p.uid}, iid={p.iid}, r_ui={p.r_ui}, est={p.est}, {p.details}')

    predictions_uid_and_iid_lookup = generate_pred_set(loaded_predictions)

    get_top_n_test(trainset=trainset, algo=loaded_algo, uid=uid)

    get_top_n_for_k_test(trainset=trainset, algo=loaded_algo,
                         pred_uid_and_iid_lookup=predictions_uid_and_iid_lookup, uids=uids)

    get_top_n_global_test(trainset=trainset, dataset=dataframe)

    get_top_n_users_test(trainset=trainset, algo=loaded_algo, uid=uid)

    get_top_n_for_genre_test(trainset=trainset, algo=loaded_algo, genre='fiction', uid=uid)

    get_top_n_for_k_for_genre_test(trainset=trainset, algo=loaded_algo, uids=uids,
                                   pred_uid_and_iid_lookup=predictions_uid_and_iid_lookup, genre='fiction')

    get_top_n_global_for_genre_test(trainset=trainset, dataset=dataframe, genre='fiction')

    get_top_n_clubs_test(loaded_algo, trainset, 'fiction', uid=uid)
