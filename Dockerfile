FROM node:16-alpine3.11

RUN mkdir -p /usr/src/athena

WORKDIR /usr/src/athena

COPY . /usr/src/athena

RUN yarn install

RUN yarn build

RUN cp .env build

WORKDIR /usr/src/athena/build

RUN yarn install --production

EXPOSE 5555

COPY . /usr/src/athena/build

CMD ["yarn", "start"]
