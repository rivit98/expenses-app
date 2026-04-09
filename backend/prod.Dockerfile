FROM alpine/git AS version
COPY .git /repo/.git
RUN git -C /repo rev-parse --short HEAD > /.version

FROM python:3.14

WORKDIR /app
COPY pyproject.toml pyproject.toml
RUN pip install --no-cache-dir .

COPY . ./
COPY --from=version /.version .version

RUN chmod +x ./run.sh
CMD ./run.sh
