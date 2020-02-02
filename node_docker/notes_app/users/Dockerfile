FROM node:10.18.1-alpine3.10
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm i
COPY . .
EXPOSE 8080
ENV PORT=8080
ENV HOST=0.0.0.0
ENV REDIS_PORT=6379
ENV REDIS_HOST=redis
ENV DEBUG=http:server*,express:notes*
ENTRYPOINT [ "npm", "start" ]