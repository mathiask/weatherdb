FROM node
LABEL description="Read temperature data from openweathermap and send it to server"
LABEL version="0.1"
MAINTAINER Mathias Kegelmann

WORKDIR /app

COPY . .

ENTRYPOINT ["node", "perugia.js"]

