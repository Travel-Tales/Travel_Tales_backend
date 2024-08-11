FROM node:18.17.0 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18.17.0

WORKDIR /app

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci

EXPOSE 9502

CMD [ "node", "dist/main.js" ]