FROM node:14.21.3-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install
RUN apk add --update --no-cache openssl1.1-compat
COPY . .

# Remove previous prisma client installation
RUN rm -rf node_modules/@prisma/client

# Generate prisma client
RUN npx prisma generate


EXPOSE 3000

CMD npm start
