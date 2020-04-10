FROM node:12

RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /app
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/. .

ENTRYPOINT node /app/index.js
