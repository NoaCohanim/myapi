FROM node:20.12.1-bullseye-slim

WORKDIR /usr/src/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD node app.js 
