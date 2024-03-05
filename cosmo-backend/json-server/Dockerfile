FROM node:18-bullseye

ARG DOCKER_TAG
ENV APP_VERSION=$DOCKER_TAG

COPY . /app
WORKDIR /app

EXPOSE 5300

RUN npm install

ENTRYPOINT ["node", "server.js"]
