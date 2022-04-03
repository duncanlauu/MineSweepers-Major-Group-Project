## Our approach to testing

### Backend
The backend part, written in django is tested using the django testing, namely TestCase classes. We have test
files for all the models in app/tests/models and the recommender system functionality in app/tests/recommender_system.

#### Recommender system
We deemed testing the correctness of the data returned by the recommender system essentially impossible. We assume surprise
provides correct predictions for the data we're giving it. We thus test all functions that we build upon surprise, 
but we cannot test for the actual "numbers" because the training process is randomised. Instead, we test that the 
return values from the functions are of expected size, that the results are in the order we expect and that we get the
results when we expect them. We also test some file management functions we created to speed up the loading and training times.

We made some decisions at the beginning of the project which limit the dataset.

We assumed that a rating of 0 in the BX-Book-Ratings.csv meant that the user didn't rate the book, and we can filter those
out. This improved our RMSE significantly. This decision was consulted with Dr Keppens during his office hours 
(by Mikolaj Deja) and deemed acceptable.
We then filter the dataset to only include the ratings for the books that appear in the BX-Books.csv file. 

The above sentence is a simplification, the precise steps are as follows. We built a tool to scrape the genres from the 
Google Books API for all the books in the BX-Books.csv file. Then the file with the appended genres is saved.
Consequently, in the seeder we load all the books from that file to the database and the BX-Book-Ratings.csv file is 
then filtered by the books we have in the database.

The original file has about 1.2 million rows and the final filtered one has about 400k rows. To save the time for all 
that loading and filtering we save the filtered dataset and use that later on.

We test the correctness of the saved filtered dataset against the original dataset with all the filters applied to it.

### API calls
To communicate between the backend and React we created restful resources and use django rest framework for it.
We created APIViews and test those using APITestCase. Those tests are in app/tests/views

They utilise all kinds of HTTP methods, such as GET, POST, PUT and so on. We test all the functionality our APIs provide.

Some APIs, for instance the RecommenderSystemView or SearchView require a seeded database. Since we seed the database
with all 270k books that takes a lot of time. We decided to make sure our functionality is tested thoroughly and sacrifice
the atomicity of tests. All tests for one API work on the same test database now, which is achieved by creating only
one test function which calls other functions. Thus, the setUp method which has all the seeding is called only once.

For example, the test_recommender_system_view only has 1 test, but it calls 44 functions which test all the functionality.

This approach was discussed during one of our advisory meetings and was deemed acceptable.


At the time of writing, there are 384 tests (all passing) after running the 
```
$ python3 manage.py test
```
command. The real number of tests is higher, as described above (about 500).

### Frontend
Frontend testing proved challenging for us. We utilise jest and react testing framework for unit testing of the react
components and selenium for integration testing.

#### Jest and react-testing-library
We used react-testing-library in conjunction with jest to test the components of the frontend. 
At the time of writing we have 46 test suites with 285 tests (all passing).

You can run the tests by running the following commands:
```
$ cd frontend
$ npm run test
```

We mock the backend API calls in the frontend tests by mocking the axios library. We created a mockData folder
which contains fake data, returned as JSON. We then test for existence and non-existence of that data in the React
components. We also check dynamic data such as the number of books in the search results. Mocking more complex components
turned out challenging, and we decided to utilise selenium for integration testing instead. Thus, jest tests are rather
simple.


#### Selenium
To be added