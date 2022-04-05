# MineSweepers

## Team members:
Vedeesh Bali<br />
Mikolaj Deja<br />
Patrik Horsky<br />
Duncan Lau<br />
Valentin Magis<br />
Eduard Orlow<br />
Yonathan Setiawan<br />
Simon Virag<br />

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

To run selenium tests you need to download a chrome webdriver according to the chrome version installed
on your computer and add it to the PATH. ChromeDriver can be downloaded [here](https://sites.google.com/chromium.org/driver/)
ChromeDriver [Setup instructions](https://sites.google.com/chromium.org/driver/getting-started?authuser=0)

Run all backend tests with:

```
$ python3 manage.py test
```

Run all selenium frontend functionality tests in headless mode with: (Reasons for splitting them up described in testing.md)

```
$ python3 manage.py test app.tests.selenium._test_frontend_functionality
```

Or to run them in a mode where you can see the browser during test execution use:

```
$ RUN_HEADLESS=False python3 manage.py test app.tests.selenium._test_frontend_functionality
```

Here you might see if the installation process was correct. If the test_websocket_chat_consumer.py has some errors that
probably means that Redis is not running.

Run all frontend tests with:
```
$ cd frontend
$ npm run test
```

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
and get a user from there, for instance:
```python
from app.models import User
print(User.objects.all()[5].username) 
# This gives you the username of the 5th user, you can replace the index with whatever you want (up to the number of users)
```
You can then log in as that person.

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

### Miscellaneous
+ The packages in requirements.txt
+ Integration of Django and React ( `frontend/babel.config.json`, `frontend/webpack.config.js`, `frontend/templates/frontend/index.html`, `frontend/src/index.js` ): https://medium.com/codex/how-to-integrate-react-and-django-framework-in-a-simple-way-c8b90f3ce945
+ Downloading Calendar events ( `frontend/src/downloadCalendar.js`, lines 30-35 ): https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
+ Password Reset ( `bookclub/settings.py`, `app/tests/views/test_email_view.py`, `app/views/email.py` ): https://saasitive.com/tutorial/django-rest-framework-reset-password/
+ Search (`app/views/search_view.py`) : https://www.codingforentrepreneurs.com/blog/a-multiple-model-django-search-engine

### Messaging
+ Backend Channels ( `app/routing.py`, `bookclub/asgi.py`, `app/consumers.py`, `app/views/chat_views.py` ): https://channels.readthedocs.io/en/stable/tutorial/index.html
+ Frontend + Backend: ( `app/routing.py`, `bookclub/asgi.py`, `app/consumers.py`, `app/views/chat_views.py`, `frontend/src/components/Chat`, `frontend/src/components/Chat/Contact.js`, `frontend/src/components/Chat/Sidepanel.js`, `frontend/src/websocket.js` ): https://www.youtube.com/playlist?list=PLLRM7ROnmA9EnQmnfTgUzCfzbbnc-oEbZ

### Authentication
+ Axios calls with JWT for receiving data from backend ( `frontend/src/axios.js` ): https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/axios.js
+ Settings ( `bookclub/settings.py` ): https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html
+ Blacklisting tokens ( `app/views/authentication_views.py` ), creating users ( `app/views/account_views.py` ): https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/django/users/views.py
+ Protected routes: ( `frontend/src/components/hooks/useAuth.js`, `frontend/src/components/RequireAuth/RequireAuth.js`, `frontend/src/components/context/AuthProvider.js` ): https://github.com/gitdagray/react_protected_routes/blob/a16142d7e2ce2269f360541d663e15d731102cb4/src/

### Testing
+ Mocking the useParams hook for frontend tests: https://tomalexhughes.com/blog/testing-components-that-use-react-router-hooks
+ Mocking local storage: https://www.codeblocq.com/2021/01/Jest-Mock-Local-Storage/
+ Mocking axios for testing ( `__mocks__/axios.js` ): https://stackoverflow.com/a/70590795/18134517


## Security
We made the applications security realistic by utilising the industry standard stateless authentication system with JWT.
When logging in, the user recieves an access and refresh token. Every request to the backend that requires a user to be authenticated checks the validity of the access token. If it is invalid, the user is redirected to the login page.