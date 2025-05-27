FROM python:3.13

WORKDIR /app
COPY pyproject.toml pyproject.toml

COPY . ./
RUN pip install --no-cache-dir .

RUN chmod +x ./run.sh
CMD ./run.sh
