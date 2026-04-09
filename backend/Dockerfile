FROM python:3.14

WORKDIR /app
COPY pyproject.toml .
RUN pip install --no-cache-dir .[dev]

CMD ["python", "manage.py", "runserver", "0.0.0.0:5002"]
