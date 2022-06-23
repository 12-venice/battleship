FROM ubuntu:latest
RUN apt update && apt install -y nodejs && apt install -y npm

WORKDIR ./app

COPY ./.env ./.env
COPY ./src ./src
COPY ./serverModels ./serverModels
COPY ./serverRoutes ./serverRoutes
COPY ./socketRoutes ./socketRoutes
COPY ./images ./images
COPY ./webpack ./webpack
COPY ./webpack.config.ts ./webpack.config.ts
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./prod.tsconfig.json ./prod.tsconfig.json

EXPOSE 5000

CMD npm install && npm run start:production
