web: gunicorn bookclub.wsgi
web2: daphne bookclub.asgi:application --port $PORT --bind 0.0.0.0 -v2
chatworker: python manage.py runworker --settings=bookclub.settings -v2