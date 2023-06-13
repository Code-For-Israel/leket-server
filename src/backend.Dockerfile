FROM node:18-alpine3.17

WORKDIR /usr/src/app

COPY package.json .
RUN npm install
RUN apk add --update --no-cache openssl1.1-compat
COPY . .

# Prisma configuration
# RUN npx prisma migrate dev --name init

RUN npx prisma migrate deploy --force

EXPOSE 3000

CMD npm start
