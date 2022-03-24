# MineSweepers-Major-Group-Project

## Team members:
Vedeesh Bali
Mikolaj Deja
Patrik Horsky
Duncan Lau
Valentin Magis
Eduard Orlow
Yonathan Setiawan
Simon Virag

## General remarks
This is a book club project. In this repo, we have the web-based social networking platform, integrated with the recommender
system we chose. The process of testing and choosing the recommender system is described in detail in the recommender repo.

The backend for the application is written in Django. We created APIs using the django rest framework and connected
it with React.

Testing of the application is described in detail in the testing.md file.


## Installation instructions:
To install the software and use it in your local development environment, first you must set up and activate a local development environment. From the root of the project:

```
$ virtualenv venv
$ source venv/bin/activate
```

Install all the required packages:

```
$ pip3 install -r requirements.txt
```

Migrate the database:

```
$ python3 manage.py migrate
```

Seed the database:

```
$ python3 manage.py seed
```

Train and save to disk the recommender system model and run some tests for it with:

```
$ python3 manage.py test_recommender
```

What's important, the trained model is crucial for the correct behaviour of the application. It is assumed you have that 
file in app/files/dump_file. If you don't want to wait for all the tests, it is safe to Ctrl-C the script when you see any
predictions or recommendations, starting with 'Loaded algo prediction'. It is assumed that you have seeded the database
before because we only train the models on the books that are both in the app/files/BX-Book-Ratings.csv and app/files/BX_Books_genres.csv

The app/files/BX_Books_genres.csv file is created using the genre scraping script that can be found in the recommender repo
but you should have access to it as it's on GitHub.


For the chat functionality, you need to install and run Redis.
The installation instructions for that are [here](https://redis.io/docs/getting-started/)

Run all tests with:

```
$ python3 manage.py test
```

Here you might see if the installation process was correct. If the test_websocket_chat_consumer.py has some errors that
probably means that Redis is not running.

Run the server and access the application:

```
$ python3 manage.py runserver
```

Open a new terminal and run the following commands

```
$ cd frontend
$ npm install
$ npm run dev
```

When the React server complies correctly, you can open a browser and navigate to
_localhost:8000_
There are some default users created in the seeding as well as a bunch of randomly seeded ones.
You can create an account and go through the book rating process or log in as one of the following:
"Jeb", "Billie", "Bob", "Val" 
with password "Password123"

All seeded users also have a password "Password123" and you can open the sqlite database and find a username or 
use the django shell 
```
$ python3 manage.py shell
```
and get a user from there (for instance:
```python
from app.models import User
print(User.objects.all()[5].username) 
# This gives you the username of the 5th user, you can replace the index with whatever you want (up to the number of users)
```
). You can then log in as that person.

All users have randomly generated clubs, meetings, book ratings, posts, and friends.

### Installation problems:
We found that the surprise library sometimes doesn't play nice with the older versions of numpy and sometimes
when you install the requirements pip will used some cached files. If you get problems when running test_recommender
which complain about an old version of C, follow those commands:

```
$ pip3 uninstall numpy
[confirm uninstallation with Y]
$ pip3 install numpy 
```

## Sources
+ The packages in requirements.txt
+ frontend/src/components/Meetings/Meetings.js lines 30-35 are adapted from https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react