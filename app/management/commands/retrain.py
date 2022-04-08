import time

from django.core.management import BaseCommand
from surprise import SVD

from app.models import UserRecommendation, BookRecommendation, ClubRecommendation, BookRecommendationForClub
from app.recommender_system.file_management import train_model, test_model, dump_trained_model, get_combined_data, \
    get_dataset_from_dataframe, get_trainset_from_dataset


def remove_recommendations():
    """Remove all previous recommendations from the database"""

    UserRecommendation.objects.all().delete()
    BookRecommendation.objects.all().delete()
    ClubRecommendation.objects.all().delete()
    BookRecommendationForClub.objects.all().delete()


def retrain_the_model():
    """Retrain the model"""

    csv_file_path = 'app/files/BX-Book-Ratings-deployed.csv'
    dump_file_name = 'app/files/dump_file'
    dataframe = get_combined_data(csv_file_path)
    data = get_dataset_from_dataframe(dataframe)
    trainset = get_trainset_from_dataset(data)
    algo = SVD()
    train_model(algo, trainset)
    pred = test_model(algo, trainset)
    dump_trained_model(dump_file_name, algo, pred)


class Command(BaseCommand):
    """A class for retraining the model and updating the recommendations"""

    def handle(self, *args, **options):
        start = time.time()
        remove_recommendations()
        retrain_the_model()
        end = time.time()
        print('Time taken to retrain the model: '.format(end - start))
        return 
