FROM python:3.13

WORKDIR /app
COPY pyproject.toml pyproject.toml
RUN pip install --no-cache-dir .[dev]

COPY . ./

CMD ./run.sh
