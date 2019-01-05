FROM node:8.9-alpine

MAINTAINER Caaalabash

WORKDIR /app

COPY package.json /app

RUN npm install

ENV NODE_ENV prod

COPY . /app

EXPOSE 7777

CMD ["npm", "run", "start:prod"]