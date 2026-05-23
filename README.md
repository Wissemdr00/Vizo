# Vizo

Turn data into answers, charts, and reports — fast.

Vizo is a Julius.ai-style analytics workspace for data analysts. Connect your datasets or databases, chat with an AI analyst, and get actionable insights with SQL, Python, and visualizations.

## What you can do

- Chat with your data using SQL + Python tools
- Connect CSV, Excel, JSON, PostgreSQL, and MySQL
- Paste a connection URL (Supabase/Neon) or enter fields manually
- Auto‑introspect schemas and profile tables
- Generate charts and reports inside the workspace
- Keep conversation history per workspace

## Tech stack

- Next.js 16, React, TypeScript
- Vercel AI SDK v6 (OpenAI, Anthropic, OpenRouter)
- Drizzle ORM + PostgreSQL (app database)
- DuckDB + Pyodide for local analytics
- Tailwind CSS + shadcn/ui
- Vitest for unit testing

## Quick start

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create `.env` and set required variables (see below).
3. Start the dev stack:
   ```bash
   pnpm dev
   ```

### Environment variables

```
DATABASE_URL=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=
```

## Scripts

- `pnpm dev` — Next.js app + Inngest dev server + email preview
- `pnpm build` — production build
- `pnpm start` — production server
- `pnpm lint` — ESLint
- `pnpm test` — Vitest run
- `pnpm test:watch` — Vitest watch mode

## Project structure

- `src/` — application code
- `public/` — static assets
- `db/` — Drizzle schema and migrations
- `docs/` — docs site (optional)

---

Built for fast, analyst‑first workflows.
