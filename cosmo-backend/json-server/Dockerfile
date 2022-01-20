FROM node:alpine
COPY ./json-server /app/json-server
COPY /package.json /app/package.json
WORKDIR /app

RUN npm install
CMD ["node", "/app/json-server/server.js"]