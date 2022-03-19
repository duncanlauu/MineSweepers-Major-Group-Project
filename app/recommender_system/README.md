## Recommender System
#### Implement some basic functionality for the recommender system:
+ Recommending top n books for a user
  + For all items
  + For a given genre
+ Recommending top n books for a club
  + For all items
  + For a given genre
+ Recommending top n books globally using weighted average that takes into consideration the number of ratings
  + For all items
  + For a given genre
+ Recommending top n users for a user (similar in terms of book ratings)
  + Using the top n books for a user
  + Using a random set of books
  + Using a set of books from a specified genre
+ Recommending top clubs for a user (similar in terms of book ratings of all members)
  + Using the top n books for a user
  + Using a random set of books
  + Using random set of books from a given genre
  + Using the clubs' books

#### Use the optimal algorithm with optimal parameters (as found in the evaluator tool)
+ SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)