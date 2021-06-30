FROM node:15.8.0-alpine3.10

RUN mkdir -p /usr/src/artapi
WORKDIR /usr/src/artapi

COPY . /usr/src/artapi

RUN apk update && \
    apk add git

RUN yarn install

RUN yarn build

RUN cp .env build

WORKDIR /usr/src/artapi/build

RUN yarn install --production

EXPOSE 5555

CMD ["yarn", "start"]
