# Forma v0.1.0 full-stack architecture

The original `README.md` remains the unmodified product specification.

## Architecture

The React PWA writes to IndexedDB first. Records use browser-generated UUIDs and `PENDING`, `SYNCING`, `SYNCED`, or `FAILED` metadata. A debounced synchronization service sends pending records through the Express API and reconciles them without blocking active workout input. Local storage is partitioned by authenticated user ID. Supabase Auth is the sole identity provider. Express verifies each bearer token, derives ownership from the verified user, and Prisma accesses PostgreSQL in the isolated `forma` schema.

## Database

The dedicated Supabase project is `Forma-db` (`gxsclhtopjxzxewxwezx`). It contains a private `forma` schema. Migrations created the user, profile, goal, food, food log, favorite, weight, routine, workout, and mutation receipt records. The schema contains no development seed data. Every user-owned table has RLS, UUID identifiers, ownership constraints, and query indexes. The Forma user ID references the `auth.users(id)` table in `Forma-db`.

Forma is isolated from `AgriPrice-db`. The temporary `forma` schema and its Forma migration records were removed from `AgriPrice-db` after the same three migrations were verified in `Forma-db`. AgriPrice's existing `public` schema was not modified. Supabase advisors were run after migration. Forma policy and foreign-key findings were resolved. Unused-index notices are expected while the new Forma tables are empty. A pre-existing `public.rls_auto_enable()` warning in `Forma-db` is unrelated to Forma and was left unchanged.

## Authentication

The frontend uses the Supabase publishable key for sign-up, sign-in, token refresh, and logout. Passwords never enter Forma's database or IndexedDB. The backend verifies tokens with Supabase and never accepts a client-supplied owner ID. Cached records use a user-specific IndexedDB key, preventing another account on the same browser from opening the previous user's local dataset.

## API

All endpoints use `/api/v1`. Available groups are auth/session, profile, goals, foods, food logs, favorites, barcodes, weight, routines, workouts, progress, and synchronization. Collection writes are idempotent by client UUID. Resource lookup, update, and deletion include server-side ownership checks. Errors use `{ error: { code, message, fields } }` and do not expose Prisma or SQL details.

## Open Food Facts

Barcode input is restricted to 8–14 digits. The backend constructs the provider URL, applies an eight-second timeout, requests only required fields, and normalizes the result into Forma's food shape. Missing, invalid, unavailable, and incomplete products return controlled outcomes. Users review external values before logging them.

## Local development

1. Copy `.env.example` and `backend/.env.example` to their local `.env` files.
2. Add the Supabase project URL and publishable key to the frontend.
3. Add PostgreSQL pooler and direct connection strings plus the same Supabase URL and publishable key to the backend.
4. Run `npm install` in the repository root and `backend`.
5. Run `npm run prisma:generate` in `backend`.
6. Start the API with `npm run dev` in `backend`, then start the PWA with `npm run dev` in the root.

For a fresh database, review and deploy Prisma migrations using `npm run migrate:deploy`. The connected development project already received the same migrations through the managed Supabase migration workflow.

## Dependency decisions

Recharts was migrated from the unsupported 2.15 line to 3.10.1. Vitest was deliberately migrated to 5.0.1 to remove the reported Vitest, Vite, vite-node, and old esbuild advisories. Vite's normal esbuild installation script is required build-tool behavior; the Termux `allowScripts` warning is an environment policy and is not fixed by weakening package security. Prisma 6.12 is retained because it supports the current Node/Prisma schema with `multiSchema` enabled and avoids the advisory path introduced in later Prisma 6 releases. Express rate limiting was upgraded to 8.7.0.

## Security notes and limitations

The backend uses Helmet, configured CORS, JSON size limits, separate sensitive/general rate limits, Zod validation, redacted request logging, controlled errors, and server-derived ownership. Do not expose database URLs or service-role keys to Vite. Frontend route guards remain UX only.

Version 0.1.0 uses predictable last-write-wins reconciliation for a single user's devices. It does not implement collaborative conflict merging. Offline deletions should remain queued until acknowledged; do not clear local tombstones early. Background synchronization depends on browser/PWA execution limits, so foreground reconnection is the reliable synchronization point.
