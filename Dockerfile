# 测试多阶段构建 -> 构建前端代码
FROM node:11.15-alpine AS buildfront

WORKDIR /frontend

COPY frontend .

RUN npm install

RUN npm run build

# 构建后端代码
FROM node:11.15-alpine AS production

LABEL maintainer="caaalabash@gmail.com"

WORKDIR /app

ENV NODE_ENV=prod PORT=7001

EXPOSE 7001

COPY --from=buildfront /frontend/build/ ./frontend/dist

COPY backend ./backend

WORKDIR /app/backend

RUN npm install

CMD npm run start:prod
