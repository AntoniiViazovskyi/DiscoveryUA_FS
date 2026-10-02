# Final Team Project FS

Clean, buildable frontend workspace based on the original Next.js project.
The old NoteHub domain code and repository history are intentionally excluded.

## Requirements

- Node.js 24.4.1 (also pinned in `.nvmrc`)
- npm

## Start

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Use `cp .env.example .env.local` on macOS or Linux.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Structure

- `app` — App Router pages and planned BFF route-handler folders
- `components` — shared UI and planned modules from the team assignment
- `lib/api` — shared Axios setup
- `lib/store` — shared Zustand state
- `types` — shared TypeScript contracts
- `public` — static assets; currently empty

Do not commit real `.env` files. Add variable names with safe placeholder values
to `.env.example` whenever the application needs new configuration.
