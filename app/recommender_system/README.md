## Recommender Systems
Implement some basic functionality for the recommender system:
+ Recommending top n books for a user
+ Recommending top n books for k users
+ Recommending top n books globally using weighted average that takes into consideration the number of ratings
+ Recommending top n users for a user (similar in terms of book ratings)
+ Recommending top clubs for a user (similar in terms of book ratings of all members)
Use the optimal algorithm with optimal parameters (as found in the evaluator tool)
+ SVD(n_epochs=30, lr_all=0.004, reg_all=0.03)