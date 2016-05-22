FROM node
LABEL description="A simple node/express server connected to RethinkDB at host rethinkdb"
LABEL version="0.1"
MAINTAINER Mathias Kegelmann

WORKDIR /server

COPY package.json .
COPY src src

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
