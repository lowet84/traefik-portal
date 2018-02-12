FROM alpine as client
RUN apk add --no-cache nodejs-npm
RUN mkdir /web
ADD web/package* /web/
WORKDIR /web
RUN npm install
ADD web /web
RUN npm run build

FROM alpine
RUN apk add --no-cache nodejs-npm
RUN mkdir -p /server/static
ADD server/package* /server/
WORKDIR /server
RUN npm install
ADD server /server
COPY --from=client /web/dist /server/static
CMD npm run start
