FROM node:18-alpine3.17

WORKDIR /usr/src/app

COPY package.json .
RUN npm install
RUN apk add --update --no-cache openssl1.1-compat
COPY . .

# Remove previous prisma client installation
RUN rm -rf node_modules/@prisma/client

# Generate prisma client
RUN npx prisma migrate reset
RUN npx prisma migrate dev --name name_of_your_migration


EXPOSE 3000

CMD npm start
