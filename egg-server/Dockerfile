FROM node:lts-alpine

MAINTAINER Caaalabash

WORKDIR /app

COPY package.json /app

RUN yarn --registry=https://registry.npm.taobao.org --prod

ENV NODE_ENV=prod PORT=7001

COPY . /app

EXPOSE 7001

CMD ["npm", "run", "start:prod"]
