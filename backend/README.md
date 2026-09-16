# Forma backend

Express REST API using Supabase Auth for identity verification and Prisma for the isolated `forma` PostgreSQL schema. The browser receives only Supabase's publishable key. Database credentials remain backend-only.

Run `npm install`, copy `.env.example` to `.env`, run `npm run prisma:generate`, then `npm run dev`. Deploy migrations with `npm run migrate:deploy` after reviewing the target database.

All user-owned queries derive ownership from the verified bearer token. UUIDs supplied by offline clients provide idempotent creates. Calendar dates remain PostgreSQL `date`; workout moments are UTC timestamps.
