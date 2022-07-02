FROM node:16-alpine3.11

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY . /usr/src/api

RUN yarn install

RUN yarn build

WORKDIR /usr/src/api/build

RUN yarn install --production

EXPOSE 5555

CMD ["yarn", "start"]
