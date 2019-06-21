# 测试多阶段构建 -> 构建前端代码
FROM node:11.15-alpine AS buildfront

LABEL maintainer="caaalabash@gmail.com"

WORKDIR /frontend

COPY frontend/package.json /frontend

RUN npm install

COPY frontend /frontend

RUN npm run build

# 构建后端代码
FROM node:11.15-alpine AS production

LABEL maintainer="caaalabash@gmail.com"

WORKDIR /app

ENV NODE_ENV=prod PORT=7001

EXPOSE 7001

COPY backend/package.json /app/backend/package.json

RUN cd /app/backend && \
    npm install

COPY backend /app/backend

COPY --from=buildfront /frontend/build /app/frontend/dist

CMD cd /app/backend && npm run start:prod
