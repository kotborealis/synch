FROM node:12-alpine

RUN mkdir -p /app
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/. .

WORKDIR /app/services/cinema
ENTRYPOINT node /app/services/cinema/index.js
