FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /app
ADD . /app
COPY  ./requirements.txt /app/requirements.txt
RUN set -ex \
    && pip install --upgrade pip \
    && pip install -r requirements.txt
COPY . /app
