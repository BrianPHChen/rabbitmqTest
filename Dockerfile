FROM node:10.16
LABEL maintainer="brian770130@gmail.com"

WORKDIR /usr/src/test

COPY package.json /usr/src/test/
COPY package-lock.json /usr/src/test/

RUN npm install

ENTRYPOINT [ "node", "test.js" ]