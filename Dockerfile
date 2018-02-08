FROM alpine
RUN apk add --no-cache nodejs-npm
RUN mkdir /server
ADD server/package* /server/
WORKDIR /server
RUN npm install
ADD server /server
CMD npm run start
