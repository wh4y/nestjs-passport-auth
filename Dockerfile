FROM node:16.14.0 as dev

WORKDIR app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .
