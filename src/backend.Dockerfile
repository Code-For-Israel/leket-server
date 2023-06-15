FROM node:14.21.3-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

RUN apk add --no-cache postgresql-client

RUN apk add --update --no-cache openssl1.1-compat

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Run the migrations to apply the schema to your database
CMD ["npx", "prisma", "migrate", "deploy"]

CMD npm start
