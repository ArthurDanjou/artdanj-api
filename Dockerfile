FROM node:15.8.0-alpine3.10

RUN mkdir -p /usr/src/athena
WORKDIR /usr/src/athena

COPY . /usr/src/athena

RUN apk update && \
    apk add git

RUN yarn install

RUN yarn build

WORKDIR /usr/src/athena/build

RUN yarn install --production

EXPOSE 5555

CMD ["yarn", "start"]
