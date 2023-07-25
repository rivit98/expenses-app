FROM python:3.11

WORKDIR /app
COPY ./backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY ./backend ./

RUN chmod +x ./run.sh
CMD ./run.sh


