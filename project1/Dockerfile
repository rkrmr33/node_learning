FROM node:10.18.1-alpine3.10
WORKDIR /home/node/app
COPY ./package*.json ./
RUN npm i
COPY . .
EXPOSE 8080
ENV PORT=8080
ENV HOST=0.0.0.0
ENV DEBUG=express::server*
ENTRYPOINT [ "npm", "start" ]