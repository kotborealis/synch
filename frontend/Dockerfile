FROM node:12 AS build

ARG PUBLIC_PATH

RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /app
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN mkdir -p build
RUN npm run build

# ----

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/frontend.conf /etc/nginx/conf.d/

COPY --from=build /app/build/ /usr/share/nginx/html/
COPY frontend/static /usr/share/nginx/html/static