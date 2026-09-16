# Forma v0.1.0 frontend

Forma is a mobile-first, offline-friendly nutrition and workout tracker. The original `README.md` remains the authoritative Master Product & Technical Specification and is intentionally unmodified.

## Stack

React 19, Vite, JavaScript, Tailwind CSS, React Router, Lucide React, Recharts, IndexedDB through `idb`, Axios-ready services, and `@bryllim/workout-guide`.

## Run locally

```bash
npm install
npm run dev
```

Build and test:

```bash
npm test
npm run build
npm run preview
```

## Environment and local data

Copy `.env.example` to `.env` only when overriding the safe frontend API base URL. Never place backend secrets in Vite variables. Structured records persist in IndexedDB. Demo data is seeded on first launch. In development, Settings can restore a populated demo account or an empty account. Mock authentication is isolated and is not production security.

## PWA behavior

The production build registers `public/sw.js`, caches the application shell, and falls back to the shell while offline. User records remain in IndexedDB. Local records use client identifiers and synchronization-ready metadata where relevant.

## Project organization

- `src/features`: domain screens and workflows
- `src/components`: shared layout and UI primitives
- `src/services`: IndexedDB, API, and exercise adapters
- `src/store`: application and persistence state
- `src/utils`: testable calculations
- `src/data`: development fixtures

## Workout Guide attribution

Workout Guide code is MIT licensed. Its exercise visual assets are CC BY-SA 4.0 and include Everkinetic-derived poses. Full attribution appears in Forma under Settings → About Forma and in the upstream project's `ATTRIBUTION.md` and `LICENSES.md`.

## Current scope and backend readiness

Version 0.1.0 includes onboarding, estimated BMR/TDEE and editable nutrition targets, dashboard summaries, nutrition diary, food search/favorites/recents, custom foods, barcode fallback, weight logging, Workout Guide exercises, routines, active workout persistence, timestamps, rest timer, volume and estimated 1RM calculations, history, progress analytics, themes, loading/empty/error states, and basic offline behavior.

Backend routes remain optional. A future backend can replace local service implementations with Axios calls under `/api/v1` without rewriting feature components.
