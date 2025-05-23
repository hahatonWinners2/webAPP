FROM python:3.13-slim

RUN mkdir -p /usr/src/hackaton/backend_service
WORKDIR /usr/src/hackaton/backend_service

RUN pip install --upgrade pip
RUN pip3 install --upgrade poetry==2.1.2

COPY ./poetry.lock /usr/src/hackaton/backend_service/poetry.lock
COPY ./pyproject.toml /usr/src/hackaton/backend_service/pyproject.toml

RUN python3 -m poetry config virtualenvs.create false \
    && python3 -m poetry install --no-interaction --no-ansi \
    && echo yes | python3 -m poetry cache clear . --all

COPY . /usr/src/hackaton/backend_service