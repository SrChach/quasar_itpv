# develop stage
FROM node:12.13

RUN dpkg --add-architecture i386 && apt-get update -y
RUN apt-get -y --fix-broken install cabextract xfonts-utils

RUN wget http://ftp.de.debian.org/debian/pool/contrib/m/msttcorefonts/ttf-mscorefonts-installer_3.6_all.deb && \
    dpkg -i ttf-mscorefonts-installer_3.6_all.deb

RUN apt-get install wine -y

RUN mkdir /app
WORKDIR /app

RUN npm install -g @quasar/cli

EXPOSE 8080

COPY package*.json ./
RUN npm install
