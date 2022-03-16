"""Functionality for managing the data, models and files"""

import logging
import time

from pandas import read_csv, DataFrame, concat
from surprise import Reader, Dataset
from surprise.dump import load, dump

from app.models import BookRating, Book


def filter_out_for_books_we_have_in_the_database(df):
    """Filter out all the books that are not in the database"""

    all_database_isbns = set(book.ISBN for book in Book.objects.all())
    return df[df['ISBN'].isin(all_database_isbns)]


def get_combined_data(file_path, filtered=True):
    """Get the combined data from the database and a file"""

    if filtered:
        file_dataframe = get_filtered_dataframe_from_file(file_path)
    else:
        file_dataframe = get_dataframe_from_file(file_path)
    combined = append_database_to_file_dataset(file_dataframe)
    logging.debug(combined)
    return combined


def get_dataframe_from_file(file_path):
    """Get dataframe from a file given (and log what it looks like)"""

    # Read the data from the csv (remember about the encoding used)
    file_dataframe = read_csv(file_path, sep=';', encoding='unicode_escape')
    # Filter out the 0s (We think 0 means no rating given)
    file_dataframe = file_dataframe[file_dataframe['Book-Rating'] != 0]
    file_dataframe = filter_out_for_books_we_have_in_the_database(file_dataframe)
    logging.debug(file_dataframe)
    return file_dataframe


def get_filtered_dataframe_from_file(file_path):
    """Get a filtered dataframe from a file given (and log what it looks like)"""

    file_dataframe = read_csv(file_path, sep=',')
    logging.debug(file_dataframe)
    return file_dataframe


def append_database_to_file_dataset(file_dataframe):
    """Append the ratings from the database to the ones in the csv"""

    user_list = list(BookRating.objects.all().values('user', 'book', 'rating'))
    # make sure the uids don't clash
    # The uids in the file range from 8 to 278854
    # We can map them all by adding an offset
    # I arbitrarily chose 1000000 (we won't have that many users)
    # We probably won't have 10k either but 1mil is a nice number
    offset = 1000000
    file_dataframe['User-ID'] = file_dataframe['User-ID'] + offset
    database_dataframe = DataFrame(user_list)
    database_dataframe = database_dataframe.rename(columns={'user': 'User-ID', 'book': 'ISBN', 'rating': 'Book-Rating'})
    logging.debug(database_dataframe)
    combined = concat([file_dataframe, database_dataframe])
    return combined


def get_dataset_from_dataframe(dataframe):
    """Get dataset from a dataframe"""

    reader = Reader(rating_scale=(1, 10))
    dataset = Dataset.load_from_df(dataframe[['User-ID', 'ISBN', 'Book-Rating']], reader)
    return dataset


def get_trainset_from_dataset(data):
    """Get the trainset from the dataset (and log the number of users and items)"""

    trainset = data.build_full_trainset()
    logging.debug(f'Number of users: {trainset.n_users}')
    logging.debug(f'Number of items: {trainset.n_items}')
    return trainset


def train_model(algo, trainset):
    """Train the model (and log the time taken)"""

    start = time.time()
    algo.fit(trainset)
    end = time.time()
    logging.debug(f'Finished training in {end - start} seconds')


def test_model(algo, trainset):
    """Test the model (and log the time taken)"""

    start = time.time()
    predictions = algo.test(trainset.build_testset())
    end = time.time()
    logging.debug(f'Finished testing in {end - start} seconds')
    return predictions


def dump_trained_model(file_name, algo, predictions):
    """Dump the trained model to a file"""

    dump(file_name, predictions=predictions, algo=algo)


def load_trained_model(file_name):
    """Load the trained model from a file"""

    loaded_predictions, loaded_algo = load(file_name)
    return loaded_predictions, loaded_algo


def generate_pred_set(predictions):
    """Generate a prediction lookup set"""

    predictions_uid_and_iid_lookup = set()
    for prediction in predictions:
        predictions_uid_and_iid_lookup.add((prediction.uid, prediction.iid))
    return predictions_uid_and_iid_lookup
