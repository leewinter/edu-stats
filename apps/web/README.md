# Web Client (apps/web)

Stage: React + TanStack Query scaffold

The frontend is a Vite + React (TypeScript) application that consumes the Edu Stats API, uses TanStack Query for caching, Ant Design for baseline widgets, and shared UI primitives from `packages/ui`.

## Commands

```bash
cd apps/web
npm install          # install dependencies
npm run dev          # start Vite dev server on http://localhost:4173
npm run build        # production build
npm run preview      # preview built assets
npm run lint         # eslint
npm run typecheck    # type-only compile check
npm run test:e2e     # requires API + DB running
```

Variables expected by Vite are documented in `.env.example` (copy to `.env` as needed). Defaults point at `http://localhost:8080`, and the client automatically requests `/api/institutions` on that host.

### Shared UI imports

Vite resolves `@edu-stats/ui` to the built artifacts in `../../packages/ui/dist`, while TypeScript uses path aliases for author-time DX. Run one of the following to keep the bundle in sync while developing shared components:

```bash
cd packages/ui
npm run dev      # tsup watch (writes to dist/)
# or
npm run build    # one-off build before docker compose up or CI builds
```

## End-to-end smoke test

The Playwright suite in `apps/web/tests` exercises the institutions dashboard and verifies that seeded data renders end to end.

1. Ensure the backend + database are running (e.g., `docker compose up --build api client postgres redis rabbitmq`).
2. Start the web client on `http://localhost:4173` if it's not already running.
3. Run:
   ```bash
   npm run test:e2e
   # or with UI mode:
   npm run test:e2e:ui
   ```

Override the base URL by exporting `WEB_BASE_URL` if the client runs on a different origin (default is `http://localhost:4173`).
