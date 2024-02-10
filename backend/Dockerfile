FROM python:3.11

WORKDIR /app
COPY ./requirements-dev.txt /app/requirements-dev.txt
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements-dev.txt

COPY . ./

CMD ["python", "manage.py", "runserver", "0.0.0.0:5002"]
