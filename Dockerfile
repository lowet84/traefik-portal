FROM alpine
RUN apk add --no-cache nodejs-npm
ADD server /server
WORKDIR /server
RUN npm install
