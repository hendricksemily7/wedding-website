# Database Layer

We're using a Postgres database with Prisma 7 as an ORM for running DB migrations.

## Requirements

```bash
# Prisma CLI & client
npm install prisma --save-dev
npm install @prisma/client dotenv

# Driver adapter (required for Prisma 7)
npm install @prisma/adapter-pg pg
npm install --save-dev @types/pg
```

Also need: [Postgres.app](https://postgresapp.com/) for local development

## Local Setup

1. **Initialize Prisma** (if not done):
   ```bash
   npx prisma init --datasource-provider postgresql
   ```

2. **Set up Postgres.app**:
   - Open the app → Click "Initialize"
   - Double-click `postgres` and run:
     ```sql
     CREATE DATABASE wedding_db;
     ```

3. **Configure environment** — update `.env`:
   ```
   DATABASE_URL="postgresql://<your-mac-username>@localhost:5432/wedding_db"
   ```

4. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

5. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

## tsconfig.json

Ensure path alias is configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Prisma 7 Notes

- **Import from `/client`**: 
  ```typescript
  import { PrismaClient } from '@/generated/prisma/client';
  ```

- **Model casing**: Prisma camelCases model names, so `RSVP` becomes `prisma.rSVP`

- **Driver adapter required**: See `src/lib/prisma.ts` for setup

## Commands

| Command | Description |
|---------|-------------|
| `npx prisma generate` | Regenerate client after schema changes |
| `npx prisma migrate dev --name <name>` | Create & run a new migration |
| `npx prisma migrate deploy` | Run pending migrations (production) |
| `npx prisma studio` | GUI to view/edit data |
| `npx prisma db push` | Push schema without migration (dev only) |

## Production

For deployed environments, set `DATABASE_URL` to our cloud database, and run `npx prisma studio` or simply visit https://console.neon.tech/