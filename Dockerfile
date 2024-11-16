FROM node:18.17.0-alpine as builder

ENV NODE_PATH="/usr/src/app/node_modules"
ENV PATH="$NODE_PATH/.bin:$PATH"

WORKDIR $NODE_PATH/..

ADD package*.json ./

RUN apk update && \
    npm install -g @nestjs/cli && \
    npm install --production

COPY . .

RUN ["npm", "run", "build"]

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]
