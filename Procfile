release: python manage.py migrate
web: daphne bookclub.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker channels --settings=bookclub.settings -v2