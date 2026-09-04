FROM python:3.14

ARG GIT_SHA

WORKDIR /app
COPY pyproject.toml pyproject.toml
RUN pip install --no-cache-dir .

COPY . ./
RUN echo "${GIT_SHA}" | cut -c1-7 > .version

RUN chmod +x ./run.sh
CMD ["./run.sh"]
