# UI Library (packages/ui)

Stage: Storybook + Ant Design scaffold

This package contains the shared React component library consumed by client applications. Components are authored in TypeScript, styled via Ant Design, and bundled with `tsup` for CJS/ESM consumers.

## Available components

- `StatisticsCard` – summary metric tile with title/value/trend label support.
- `InstitutionsTable` – standardized Ant Design table markup for institution listings, including optional row-level edit action wiring.
- `InstitutionFormModal` – form-in-a-modal for creating/editing institution records with validation baked in.

## Commands

```bash
cd packages/ui
npm install            # install deps
npm run dev            # watch build with tsup
npm run build          # emit /dist for publishing or local consumption
npm run storybook      # launch Storybook on http://localhost:6006
npm run build-storybook
```

### Storybook

Storybook runs with the Vite builder and includes the essentials + interactions addons for knobs, docs, and testing hooks. Stories live alongside the source (`src/**/*.stories.tsx`).

### Consumption

- Local development: the web client imports `@edu-stats/ui` through Vite aliases pointing at `src/`, so changes hot-reload instantly.
- Packaging/deployment: run `npm run build` to emit distributable bundles in `dist/`. Downstream apps or pipelines can `npm pack` this directory or publish it to an internal registry when ready.
