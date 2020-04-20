FROM node:12-alpine

RUN mkdir -p /app
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/. .

WORKDIR /app/services/router
ENTRYPOINT node /app/services/router/index.js
