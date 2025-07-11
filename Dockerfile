FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json /app/
RUN npm i
COPY . /app/
RUN npm run build

FROM node:20-alpine
RUN apk add mc
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i --omit=dev
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD [ "sh", "-c", "node ./build/index.js" ]
