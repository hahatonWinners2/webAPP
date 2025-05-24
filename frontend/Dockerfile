FROM node:18-alpine


RUN mkdir -p /usr/src/hackaton/frontend
WORKDIR /usr/src/hackaton/frontend

COPY package.json .

RUN npm install

RUN mkdir node_modules/.vite && chmod -R 777 node_modules/.vite

COPY . .