FROM python:3.12

WORKDIR /app
COPY requirements-dev.txt requirements.txt /app/
RUN pip install --no-cache-dir -r requirements-dev.txt

COPY . ./

CMD ["python", "manage.py", "runserver", "0.0.0.0:5002"]
