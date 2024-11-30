#!/bin/bash

set -e

python manage.py collectstatic --noinput
gunicorn expenses_tracker.wsgi --bind 0.0.0.0:5002 --workers 1 --preload
