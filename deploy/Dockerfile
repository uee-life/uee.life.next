FROM node:current

ENV APP_ROOT /src

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
COPY ../package*.json ./
RUN npm install
ADD ../app/. ${APP_ROOT}
RUN npm run build

ENV HOST 0.0.0.0
