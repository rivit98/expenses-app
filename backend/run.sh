#!/bin/bash

set -e

python manage.py collectstatic --noinput
python manage.py migrate
gunicorn progress_tracker.wsgi --bind 0.0.0.0:5002 --workers 2 --preload
