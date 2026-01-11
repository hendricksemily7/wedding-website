# Database layer
We're using a Postgres database with prisma as an ORM for running DB migrations.

## Requirements:
* Prisma + dotenv `npm install prisma --save-dev && npm install @prisma/client dotenv`
* Postgres app [postgresapp.com]

## Setup:
1. Initialize prisma with postgres: `npx prisma init --datasource-provider postgresql`
2. Open the postgres app, click initialize
3. double click postgres and run `CREATE DATABASE <database name>;`
4. update .env: `DATABASE_URL="postgresql://<username>@localhost:5432/wedding_db"`

## Migration:
- Run migrations: `npx prisma migrate dev --name <describe-change>`

## Viewing the tables:
- `npx prisma studio`