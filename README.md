# Indie Kit

Indie Kit is a Next.js boilerplate for building SaaS products with auth, billing, email, and background jobs included.

## Features

- Next.js 16
- NextAuth authentication
- Drizzle ORM data access
- Inngest background jobs
- React Email templates
- Fumadocs documentation
- AI SDK provider integrations

## Getting Started

Prerequisites: Node.js and pnpm.

1. Clone the repo
2. Run `pnpm install`
3. Run `pnpm dev`
4. Open http://localhost:3000

## Scripts

- `pnpm dev` - run the app, Inngest dev server, and email preview
- `pnpm build` - build the Next.js app
- `pnpm start` - start the production server
- `pnpm lint` - run ESLint
- `pnpm test` - run unit tests with Vitest
- `pnpm test:watch` - run tests in watch mode

## Local Services

When running `pnpm dev`, these services start by default:

- Next.js app: http://localhost:3000
- Inngest dev server: http://localhost:8288
- Email preview: http://localhost:3001

## Project Structure

- `src/` - application code
- `docs/` - documentation content
- `public/` - static assets
- `scripts/` - repo scripts


