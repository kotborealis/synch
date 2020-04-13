FROM node:12

RUN mkdir -p /app
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/. .
COPY common/. /common/.

ENTRYPOINT node /app/services/router/index.js
