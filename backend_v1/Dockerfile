FROM python:3.13-slim

RUN mkdir -p /usr/src/hackaton/backend
WORKDIR /usr/src/hackaton/backend

RUN pip install --upgrade pip
RUN pip3 install --upgrade poetry==2.1.2

COPY ./poetry.lock /usr/src/hackaton/backend/poetry.lock
COPY ./pyproject.toml /usr/src/hackaton/backend/pyproject.toml

RUN python3 -m poetry config virtualenvs.create false \
    && python3 -m poetry install --no-interaction --no-ansi \
    && echo yes | python3 -m poetry cache clear . --all

COPY . /usr/src/hackaton/backend