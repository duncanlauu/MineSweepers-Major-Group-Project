### The following document specifies the use of the recommender system API.

### Required files
The system needs the _BX-Book-Ratings.csv_ file in _app/files_ and a trained model in the same 
folder. The trained model with predictions is called _dump_file_.


### Training the model
To train the model and save it, one needs to send a post request to a url called 
_recommender_action_ with kwargs={'action': 'retrain'}

### Overall structure
I use two types of requests: get and post. I didn't find the need to use delete, update or 
put although this might change at some point. The purpose of the post requests is to 
calculate the recommendations according to the provided parameters and save the results 
in the database. The get request is used to retrieve the saved recommendations from 
the database.

I created appropriate models for saving all the recommendations:
+ BookRecommendation - used for recommending a book to a user 
+ UserRecommendation - used for recommending a user to a user 
+ ClubRecommendation - used for recommending a club to a user 
+ BookRecommendationForClub - used for recommending a book to a club 
+ GlobalBookRecommendation - used for recommending a book with no specified user (all users)

### The post request operates as follows:

First, prepare all the necessary data:
+ The csv file of ratings combined with the ratings from the database 
+ Create a dataset from the dataframe 
+ Create a trainset from the dataset 
+ Load the predictions and the trained algorithm

Then, find the appropriate action to perform (the kwargs['action'] parameter)

Clear the database from recommendations from the same action

Calculate the recommendations using functions from _app/recommender_system_

Save the calculated recommendations to the database by wrapping them in the model objects

Return the raw calculated recommendations (not objects) (mostly used for testing purposes)

### The get request operates as follows
Find the appropriate action to perform (the kwargs['action'] parameter)

Retrieve the items from the database

Serialize the data and return it in a Response object (accessible by response.data which 
gives an OrderedDict of the model objects)

### List of defined requests with necessary parameters
1. Post
   1. retrain 
      1. Retrain the model and save it (and the predictions) as _app/files/dump_file_
      2. args={'action': 'retrain'} 
      3. url = reverse('app:recommender_action', kwargs=args)
      4. Response(data='Model has been trained', status=status.HTTP_200_OK)
   2. top_n
      1. Calculate and save to the database the top between m and n books for a particular user
      2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n'} 
      3. url = reverse('app:recommender_top_n', kwargs=args)
   3. top_n_for_genre
      1. Calculate and save to the database the top between m and n books for a particular user for a particular genre  
      2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n_for_genre', 'genre': the genre for which we want to calculate recommendations}
      3. url = reverse('app:recommender_top_n_for_genre', kwargs=args)
   4. top_n_for_club
      1. Calculate and save to a database the top between m and n books for a club
      2. args = {'m': the left index of top books, n': the right index of top books, 'id': the club id for which we calculate recommendations, 'action': 'top_n_for_club'}
      3. pred_lookup = generate_pred_set(self.pred)
      4. url = reverse('app:recommender_top_n', kwargs=args)
   5. top_n_for_club_for_genre
      1. Calculate and save to a database the top between m and n books for a club using a particular genre
      2. args = {'m': the left index of top books, n': the right index of top books, 'id': the club id for which we calculate recommendations, 'action': 'top_n_for_club_for_genre', 'genre': the genre for which we want to calculate recommendations}
      3. pred_lookup = generate_pred_set(self.pred)
      4. url = reverse('app:recommender_top_n_for_genre', kwargs=args)
   6. top_n_global
      1. Calculate and save to a database the global top between m and n books using true bayesian weighted average
      2. args = {'m': the left index of top books, n': the right index of top books, 'action': 'top_n_global'} 
      3. url = reverse('app:recommender_top_n_global', kwargs=args)
   7. top_n_global_for_genre
      1. Calculate and save to a database the global top between m and n books using true bayesian weighted average for a particular genre
      2. args = {'m': the left index of top books, n': the right index of top books, 'action': 'top_n_global_for_genre', 'genre': the genre for which we want to calculate recommendations} 
      3. url = reverse('app:recommender_top_n_global_for_genre', kwargs=args)
   8. top_n_users_top_books
      1. Calculate and save to a database the top between m and n users recommendations using the user top books
      2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n_users_top_books'} 
      3. url = reverse('app:recommender_top_n', kwargs=args)
   9. top_n_users_random_books 
      1. Calculate and save to a database the top between m and n users recommendations using random books
      2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n_users_random_books'} 
      3. url = reverse('app:recommender_top_n', kwargs=args)
   10. top_n_users_genre_books 
       1. Calculate and save to a database the top between m and n users recommendations using random books from a particular genre
       2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n_users_genre_books', 'genre': the genre for which we want to calculate recommendations} 
       3. url = reverse('app:recommender_top_n_for_genre', kwargs=args)
   11. top_n_clubs_top_user_books
       1. Calculate and save to a database the top between m and n club recommendations using the top user books
       2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n_clubs_top_user_books'} 
       3. url = reverse('app:recommender_top_n', kwargs=args)
   12. top_n_clubs_random_books
       1. Calculate and save to a database the top between m and n club recommendations using random books
       2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n_clubs_random_books'} 
       3. url = reverse('app:recommender_top_n', kwargs=args)
   13. top_n_clubs_genre_books
       1. Calculate and save to a database the top between m and n club recommendations using random books from a particular genre
       2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n_clubs_genre_books', 'genre': the genre for which we want to calculate recommendations} 
       3. url = reverse('app:recommender_top_n_for_genre', kwargs=args)
   14. top_n_clubs_top_club_books
       1. Calculate and save to a database the top between m and n club recommendations using the club's books
       2. args = {'m': the left index of top books, n': the right index of top books, 'id': the user id for which we calculate recommendations, 'action': 'top_n_clubs_top_club_books'} 
       3. url = reverse('app:recommender_top_n', kwargs=args)
   15. Calls without the action parameter specified
       1. Response(data='You need to provide an action', status=status.HTTP_404_NOT_FOUND)
   16. Calls with an incorrect action
       1. Response(data='You need to provide a correct action', status=status.HTTP_404_NOT_FOUND)
   17. Calls with incorrect or lacking parameters
       1. Response(data='You need to provide correct parameters', status=status.HTTP_404_NOT_FOUND)
2. Get
   1. top_n
      1. Get the top between m and n books for a particular user
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n'} 
      3. url = reverse('app:recommender_top_n', kwargs=args)
   2. top_n_for_genre
      1. Get the top between m and n books for a particular user for a particular genre  
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n_for_genre', 'genre': the genre for which we want to get recommendations}
      3. url = reverse('app:recommender_top_n_for_genre', kwargs=args)
   3. top_n_for_club
      1. Get the top between m and n books for a club
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the club id for which we get recommendations, 'action': 'top_n_for_club'}
      3. pred_lookup = generate_pred_set(self.pred)
      4. url = reverse('app:recommender_top_n', kwargs=args)
   4. top_n_for_club_for_genre
      1. Get the top between m and n books for a club using a particular genre
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the club id for which we get recommendations, 'action': 'top_n_for_club_for_genre', 'genre': the genre for which we want to get recommendations}
      3. pred_lookup = generate_pred_set(self.pred)
      4. url = reverse('app:recommender_top_n_for_genre', kwargs=args)
   5. top_n_global
      1. Get the global top between m and n books using true bayesian weighted average
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'action': 'top_n_global'} 
      3. url = reverse('app:recommender_top_n_global', kwargs=args)
   6. top_n_global_for_genre
      1. Get the global top between m and n books using true bayesian weighted average for a particular genre
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'action': 'top_n_global_for_genre', 'genre': the genre for which we want to get recommendations} 
      3. url = reverse('app:recommender_top_n_global_for_genre', kwargs=args)
   7. top_n_users_top_books
      1. Get the top between m and n users recommendations using the user top books
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n_users_top_books'} 
      3. url = reverse('app:recommender_top_n', kwargs=args)
   8. top_n_users_random_books 
      1. Get the top between m and n users recommendations using random books
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n_users_random_books'} 
      3. url = reverse('app:recommender_top_n', kwargs=args)
   9. top_n_users_genre_books 
      1. Get the top between m and n users recommendations using random books from a particular genre
      2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n_users_genre_books', 'genre': the genre for which we want to get recommendations} 
      3. url = reverse('app:recommender_top_n_for_genre', kwargs=args)
   10. top_n_clubs_top_user_books
       1. Get the top between m and n club recommendations using the top user books
       2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n_clubs_top_user_books'} 
       3. url = reverse('app:recommender_top_n', kwargs=args)
   11. top_n_clubs_random_books
       1. Get the top between m and n club recommendations using random books
       2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n_clubs_random_books'} 
       3. url = reverse('app:recommender_top_n', kwargs=args)
   12. top_n_clubs_genre_books
       1. Get the top between m and n club recommendations using random books from a particular genre
       2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n_clubs_genre_books', 'genre': the genre for which we want to get recommendations} 
       3. url = reverse('app:recommender_top_n_for_genre', kwargs=args)
   13. top_n_clubs_top_club_books
       1. Get the top between m and n club recommendations using the club's books
       2. args = {'m': the left index of top books to get, 'n': the left index of books to get, 'id': the user id for which we get recommendations, 'action': 'top_n_clubs_top_club_books'} 
       3. url = reverse('app:recommender_top_n', kwargs=args)
   14. Calls without the action parameter specified
       1. Response(data='You need to provide an action', status=status.HTTP_404_NOT_FOUND)
   15. Calls with an incorrect action
       1. Response(data='You need to provide a correct action', status=status.HTTP_404_NOT_FOUND)
   16. Calls with incorrect or lacking parameters
       1. Response(data='You need to provide correct parameters', status=status.HTTP_404_NOT_FOUND)

All correct post and get request return the status 200 OK

All correct post requests also return the raw recommendations in response.data for testing purposes
