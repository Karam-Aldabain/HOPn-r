# HOPn Admin API

NestJS + PostgreSQL + Prisma backend for the HOPn Admin Panel.

## Quick Start
1. Copy `.env.example` to `.env` and update values.
2. Run `npm install` in the repo root (workspaces).
3. Run migrations:
   `npx prisma migrate dev --schema apps/admin-api/prisma/schema.prisma`
4. Start API:
   `npm -w hopn-admin-api run dev`

The first admin user is auto-seeded from `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`.
