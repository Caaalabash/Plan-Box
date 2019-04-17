FROM node:8.9-alpine

MAINTAINER Caaalabash

WORKDIR /app

COPY package.json /app

RUN yarn --registry=https://registry.npm.taobao.org

ENV NODE_ENV prod

ENV PORT 7778

COPY . /app

EXPOSE 7778

CMD ["npm", "run", "start:prod"]
