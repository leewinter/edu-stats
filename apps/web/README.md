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
```

Variables expected by Vite are documented in `.env.example` (copy to `.env` as needed). Defaults point at `http://localhost:8080/api` for local API access.

### Shared UI imports

Vite resolves `@edu-stats/ui` to the built artifacts in `../../packages/ui/dist`, while TypeScript uses path aliases for author-time DX. Run one of the following to keep the bundle in sync while developing shared components:

```bash
cd packages/ui
npm run dev      # tsup watch (writes to dist/)
# or
npm run build    # one-off build before docker compose up or CI builds
```
