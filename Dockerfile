FROM node:10

RUN mkdir -p /root/app

WORKDIR /root/app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm ci
COPY . ./
RUN npm run build
CMD npm run start:prod
