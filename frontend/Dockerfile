FROM node:18-alpine


RUN mkdir -p /usr/src/hackaton/frontend
WORKDIR /usr/src/hackaton/frontend

COPY package.json .

RUN npm install

COPY . .