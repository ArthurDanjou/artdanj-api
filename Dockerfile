FROM node:15.8.0-alpine3.10

RUN apk add --no-cache git

RUN mkdir -p /usr/src/artapi
WORKDIR /usr/src/artapi

COPY . /usr/src/artapi

RUN whereis git

RUN yarn install

RUN yarn build

EXPOSE 5555

COPY . .

WORKDIR /usr/src/artapi/build
CMD ["yarn", "start"]
