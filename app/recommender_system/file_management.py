import logging
import time

from pandas import read_csv, DataFrame, concat
from surprise import Reader, Dataset
from surprise.dump import load, dump

from app.models import BookRating


def load_trained_model(file_name):
    loaded_predictions, loaded_algo = load(file_name)
    return loaded_predictions, loaded_algo


def dump_trained_model(file_name, algo, predictions):
    dump(file_name, predictions=predictions, algo=algo)


def train_model(algo, trainset):
    start = time.time()
    algo.fit(trainset)
    end = time.time()
    logging.debug(f'Finished training in {end - start} seconds')


def fit_model(algo, trainset):
    start = time.time()
    predictions = algo.test(trainset.build_testset())
    end = time.time()
    logging.debug(f'Finished fitting in {end - start} seconds')
    return predictions


def get_dataframe_from_file(file_path):
    # Read the data from the csv (remember about the encoding used)
    file_dataframe = read_csv(file_path, sep=';', encoding='unicode_escape')
    # Filter out the 0s (We think 0 means no rating given)
    file_dataframe = file_dataframe[file_dataframe['Book-Rating'] != 0]
    logging.debug(file_dataframe)
    return file_dataframe


def get_dataset_from_dataframe(dataframe):
    reader = Reader(rating_scale=(1, 10))
    dataset = Dataset.load_from_df(dataframe[['User-ID', 'ISBN', 'Book-Rating']], reader)
    return dataset


def append_database_to_file_dataset(file_dataframe):
    database_dataframe = DataFrame(list(BookRating.objects.all().values('user', 'book', 'rating')))
    database_dataframe.rename(columns={'user': 'User-ID', 'book': 'ISBN', 'rating': 'Book-Rating'})
    logging.debug(database_dataframe)
    combined = concat([file_dataframe, database_dataframe])
    return combined


def get_trainset_from_dataset(data):
    trainset = data.build_full_trainset()
    logging.debug(f'Number of users: {trainset.n_users}')
    logging.debug(f'Number of items: {trainset.n_items}')
    return trainset


def get_combined_data(file_path):
    file_dataframe = get_dataframe_from_file(file_path)
    combined = append_database_to_file_dataset(file_dataframe)
    return combined
