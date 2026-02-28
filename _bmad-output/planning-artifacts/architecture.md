---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-28'
project_name: 'Vizo'
user_name: 'Wissem'
date: '2026-02-28'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 53+ FRs across 10 categories. Architecturally critical areas:
- **FR-5 (AI Chat):** 13 requirements — agentic AI with 7 custom tools, multi-step reasoning, self-correction, follow-up suggestions
- **FR-6 (Code Execution):** 11 requirements — dual engine (DuckDB SQL + Pyodide Python), sandboxed, bundled credit model
- **FR-4 (DB Connectors):** 9 requirements — credential encryption, schema introspection, live read-only queries
- **FR-3 (File Upload):** 8 requirements — Supabase Storage upload, parse, schema inference pipeline

**Non-Functional Requirements:** 25+ NFRs driving architecture:
- NFR-1: AI first token < 2s, SQL execution < 10s, Python < 30s, charts < 1s
- NFR-2: AES-256 credentials, SQL injection prevention, prompt injection defense, Pyodide sandbox
- NFR-4: 1,000 concurrent users, 100K workspaces, 1M conversations
- NFR-5: Sentry errors, structured AI/execution metrics logging

### Scale & Complexity

- **Complexity:** High — agentic AI loop + dual code execution + encrypted DB connectors
- **Primary domain:** Full-stack web (Next.js SSR + client-side WASM + Vercel AI SDK agentic)
- **Estimated architectural components:** 14 major systems

### Technical Constraints & Dependencies

| Constraint | Impact |
|---|---|
| Vercel serverless (10s/60s timeout) | Agent loop must complete within 60s. Heavy ops → Inngest |
| Supabase PostgreSQL | Application data. Drizzle ORM. NOT using Supabase Auth (NextAuth kept) |
| Supabase Storage | S3-compatible file uploads, replaces AWS S3 |
| Pyodide WASM (client-side or Edge) | 3-5s cold start, 256MB memory, whitelisted packages |
| DuckDB WASM (in-memory) | File data loaded per query, max ~100MB |
| Vercel AI SDK maxSteps: 8 | Hard limit on agent tool calls per message |
| AI API costs | ~$0.02/1K tokens, bundled per user message not per tool call |

### Cross-Cutting Concerns

1. **Authentication/Authorization** — every API route, every workspace operation (NextAuth v5)
2. **Credit/Quota Enforcement** — per user message (not per tool call), before workspace/source creation
3. **Agentic Tool Safety** — SQL read-only validation, Python sandbox, maxSteps guard, self-correction limits
4. **Error Handling** — agent self-corrects (2 retries), then conversational error to user
5. **Observability** — Sentry for errors, structured logs for AI tool calls, execution metrics, cost tracking
6. **Security** — credential encryption (AES-256), prompt injection defense, sandbox escape prevention

### Key Architectural Decisions (from Party Mode)

**1. Database: Supabase PostgreSQL** (replaces Neon)
- Supabase Storage for file uploads (S3-compatible, replaces AWS S3)
- Keep NextAuth v5 (too deeply integrated to replace with Supabase Auth)
- Keep Drizzle ORM (PostgreSQL-compatible, works with Supabase)
- RLS policies can layer on later as additional security

**2. AI Architecture: Vercel AI SDK Agentic Loop** (NOT LangChain/LangGraph)
- `streamText()` with `tools` + `maxSteps: 8` for multi-step autonomous agent
- 7 custom tools: inspect_schema, execute_sql, execute_python, render_chart, profile_data, analyze_results, suggest_followups
- Agent decides which tools to call and in what order — user never specifies
- Self-correction: on tool error, agent calls analyze_results → retries with fix (max 2 retries)
- Vercel AI SDK chosen over LangGraph because: native streaming, already in stack, tool-calling loops built-in, no bloat

**3. Credit Model: Per-Message Bundling**
- 1 `ai_query` credit per user message (all tool calls in that agent loop included)
- 1 `code_execution` credit per user message that triggers any code (SQL or Python)
- Complex 5-step analysis costs same as simple 1-step — fair to users, encourages exploration

**4. PRD Updates Applied:**
- FR-5.3 rewritten for agentic multi-step tool chaining
- FR-5.5 updated to include tool call history + tool results in context
- FR-5.6 updated for bundled per-message credits
- FR-5.11–5.13 added: self-correction, follow-up suggestions, auto-profiling
- FR-6.3 rewritten for autonomous multi-tool chaining
- FR-6.10 rewritten for bundled code execution credits
- Technical constraints updated: Supabase replaces Neon/S3, agentic architecture documented

## Starter Template Evaluation

### Selected Starter: Indie Kit (Brownfield)

**Rationale:** Vizo is a brownfield project built on the Indie Kit boilerplate. The existing codebase provides ~75% of infrastructure needs. We extend rather than replace.

### What Indie Kit Provides (Keep As-Is)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js 16 App Router + React 19 | 16.1.6 / 19.2.4 |
| Language | TypeScript 5 strict | 5.8.3 |
| Styling | Tailwind CSS 4 + shadcn/ui (60+ components) | 4.1.12 |
| ORM | Drizzle ORM | 0.38.4 |
| Auth | NextAuth v5 | 5.0.0-beta.30 |
| Payments | Stripe, LemonSqueezy, Dodo, Paddle, PayPal | — |
| Background Jobs | Inngest | 3.50.0 |
| Charts | Recharts | 2.15.4 |
| Monitoring | Sentry | 10.32.1 |
| Validation | Zod 4 | 4.3.6 |
| Email | React Email + AWS SES | — |
| CSV Parsing | papaparse | 5.5.2 |
| Resizable Panels | react-resizable-panels | 3.0.3 |
| Animation | Motion (Framer) | 11.18.2 |
| Docs | Fumadocs | 16.4.11 |

### What Needs to Change

| Change | From | To | Impact |
|---|---|---|---|
| Database | `@neondatabase/serverless` | Supabase PostgreSQL (connection string swap) | Low |
| File Storage | AWS S3 SDK | Supabase Storage (S3-compatible) | Low-Medium |
| AI SDK | `openai` (raw SDK, devDeps) | `ai` + `@ai-sdk/openai` + `@ai-sdk/anthropic` | High — core |
| SQL Engine | None | `@duckdb/duckdb-wasm` | New module |
| Python Engine | None | Pyodide (client-side WASM) | New module |
| DB Connectors | None | pg + mysql2 with AES-256 encryption | New module |
| Code Highlighting | None | shiki | New dependency |

### Packages to Add

- `ai` — Vercel AI SDK core (streaming, tool calling, `maxSteps`)
- `@ai-sdk/openai` — OpenAI provider (same API key)
- `@ai-sdk/anthropic` — Anthropic provider (same API key)
- `@supabase/supabase-js` — Supabase client (Storage + DB utilities)
- `@duckdb/duckdb-wasm` — In-memory SQL for file-based data
- `mysql2` — MySQL connector for user database connections
- `shiki` — Syntax highlighting for code blocks

### Packages to Remove

- `@neondatabase/serverless` — replaced by Supabase PostgreSQL
- `@aws-sdk/client-s3`, `@aws-sdk/s3-presigned-post`, `@aws-sdk/s3-request-presigner` — replaced by Supabase Storage
- `openai` (from devDependencies) — replaced by `@ai-sdk/openai`

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. DuckDB runs server-side (API route) for MVP
2. Pyodide runs server-side (API route) for MVP
3. Vercel AI SDK `useChat` for streaming
4. App-level AES-256 for credential encryption
5. 10 agent tools (7 original + 3 proactive intelligence)
6. Analysis Templates as JSON configs
7. Report generation as composable multi-chart documents

**Deferred Decisions (Post-MVP):**
- Client-side DuckDB WASM (for offline/privacy)
- Client-side Pyodide (for zero-server execution)
- WebSocket real-time collaboration
- Supabase RLS policies (additional security layer)
- PDF report export

### Data Architecture

| Decision | Choice | Rationale |
|---|---|---|
| Application DB | Supabase PostgreSQL via Drizzle ORM | User preference, unified platform |
| File storage | Supabase Storage (S3-compatible API) | Unified with DB, presigned uploads |
| DuckDB location | **Server-side API route** | One code path, no WASM download, works all browsers. Inngest for files >50MB |
| Pyodide location | **Server-side API route** | No 15MB download for users, consistent environment, timeout managed server-side |
| Schema caching | DB-persisted after first introspection, refresh on demand | Avoid re-introspecting on every query |
| Client caching | SWR with revalidation (already in Indie Kit) | Workspace lists, conversation history, data sources |
| File data caching | None — load per query, destroy after | Security: no persistent user data in memory |

### Authentication & Security

| Decision | Choice | Rationale |
|---|---|---|
| Auth framework | NextAuth v5 (keep from Indie Kit) | Deeply integrated, works, not worth replacing |
| API protection | `withAuthRequired` middleware on all `/api/app/*` routes | Existing Indie Kit pattern |
| DB credential encryption | App-level AES-256 via `src/lib/encryption/` | Existing module, full control, no vendor lock-in |
| SQL safety | Read-only validation — reject INSERT/UPDATE/DELETE/DROP/ALTER/CREATE/TRUNCATE/GRANT | Parse before execution |
| Prompt injection | Delimiter-based system prompts, user input sanitized | Defense in depth |
| Python sandbox | Pyodide with no filesystem/network, whitelisted packages, 30s timeout, 256MB limit | Prevent sandbox escape |
| Agent guardrails | `maxSteps: 8` hard limit, `maxRetries: 2` for self-correction | Prevent infinite loops and runaway costs |

### API & Communication Patterns

| Decision | Choice | Rationale |
|---|---|---|
| Streaming | Vercel AI SDK `useChat` hook (SSE) | Built-in streaming, tool call callbacks, auto-state management |
| Agent API route | `POST /api/app/chat` using `streamText()` with tools | Single endpoint for all AI interactions |
| Tool results | Streamed via `onToolCall` client-side callback | Charts rendered when `render_chart` tool called |
| Template execution | Agent receives template config as system prompt context | Templates guide the agent, not hardcode queries |
| Report assembly | `generate_report` tool composes sections from previous tool results | Agent calls this as final step in template workflows |
| REST APIs | Next.js Route Handlers with Zod validation | Existing Indie Kit pattern for CRUD |
| Error pattern | Conversational errors (agent explains what failed) + Sentry logging | Never show raw 500s to users |

### Frontend Architecture

| Decision | Choice | Rationale |
|---|---|---|
| Chat state | `useChat` (Vercel AI SDK) for active conversation | Auto-manages messages, streaming, tool calls |
| App state | SWR for workspace/source/conversation lists | Already installed, revalidation built-in |
| UI state | React Context for panel sizes, active workspace, UI preferences | Simple, no extra dependencies |
| Component library | shadcn/ui + 10 custom composite components | Existing 60+ components + analytics-specific new ones |
| Layout | Split-panel via `react-resizable-panels` | Chat left, visualization right, keyboard presets |
| Charts | Recharts with purple-themed palette | Already installed, AI generates chart configs |
| Code highlighting | shiki (new) | Server-safe, theme-aware, better than Prism |

### Agentic AI Architecture (10 Tools)

| # | Tool | Category | Description |
|---|---|---|---|
| 1 | `inspect_schema` | Data | Read table/column structure, types, row counts, sample values |
| 2 | `execute_sql` | Execution | Run read-only SQL against DuckDB (files) or live DB |
| 3 | `execute_python` | Execution | Run Python in Pyodide sandbox (pandas, numpy, sklearn, scipy) |
| 4 | `render_chart` | Visualization | Generate interactive Recharts config from data |
| 5 | `profile_data` | Analysis | Statistical column profiling — distributions, nulls, outliers |
| 6 | `analyze_results` | Meta | Check previous tool output, decide next step, handle errors |
| 7 | `suggest_followups` | Engagement | Generate 3 contextual follow-up questions |
| 8 | `proactive_analysis` | **Intelligence** | Auto-find insights, anomalies, patterns, data quality issues |
| 9 | `apply_template` | **Intelligence** | Run pre-built analysis workflow (Meta Ads, Sales KPI, etc.) |
| 10 | `generate_report` | **Intelligence** | Assemble multi-chart report with KPIs, charts, anomalies, recommendations |

**Agent Loop Config:**
- `maxSteps: 8` — hard limit per user message
- `maxRetries: 2` — self-correction attempts on tool errors
- Templates increase effective steps (template may trigger 6-8 internal tool calls)

### Analysis Templates Architecture

Templates stored as JSON configs in `src/lib/ai/templates/`:

**Template Structure:**
- `id`, `name`, `icon`, `description`
- `requiredColumns: ColumnHint[]` — heuristic matching
- `steps: TemplateStep[]` — ordered tool call plan
- `outputs: TemplateOutput[]` — KPI cards, charts, anomalies, recommendations

**MVP Templates (7):**
1. 📊 Ad Campaign Performance (Meta, Google, TikTok)
2. 📈 Sales KPI Dashboard
3. 💰 Financial Overview (P&L, expense breakdown)
4. 🛒 E-commerce Analytics (conversion, AOV, LTV)
5. 👥 User/Customer Analytics (retention, cohorts)
6. 📉 Churn & Retention Analysis
7. ⚙️ Operations Metrics (delivery, quality, efficiency)

**Template Matching:** Agent uses column name heuristics to detect data domain and suggest matching template.

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|---|---|---|
| Hosting | Vercel (serverless) | Existing Indie Kit deployment target |
| Background jobs | Inngest | Heavy file parsing, data cleanup, scheduled tasks |
| Monitoring | Sentry (errors) + structured logs (AI metrics) | Existing Indie Kit integration |
| Email | React Email + AWS SES | Keep existing, works fine |
| CI/CD | Vercel Git integration | Automatic deploys on push |
| Environment | `.env.local` for secrets, Vercel env vars for production | Existing pattern |

### Decision Impact — Implementation Sequence

1. **Supabase setup** — connection string, storage config (blocks everything)
2. **Vercel AI SDK** — install `ai` + providers, create `/api/app/chat` route
3. **Agent tools 1-4** — inspect_schema, execute_sql, execute_python, render_chart (core loop)
4. **Chat UI** — `useChat` hook, split-panel layout, code blocks, chart rendering
5. **Agent tools 5-7** — profile_data, analyze_results, suggest_followups (intelligence layer)
6. **Agent tools 8-10** — proactive_analysis, apply_template, generate_report (proactive layer)
7. **Templates** — JSON configs + template matching + report view
8. **DB connectors** — PostgreSQL/MySQL with encrypted credentials
9. **Credits & quotas** — bundled per-message model
10. **Landing page & pricing** — purple theme, Tailark components

## Implementation Patterns & Consistency Rules

### Naming Conventions

**Database (Drizzle ORM):**
- Tables: camelCase plural → `workspaces`, `dataSources`, `conversations`
- Columns: camelCase → `userId`, `createdAt`, `workspaceId`
- Foreign keys: `entityId` pattern → `userId`, `workspaceId`
- IDs: `text` UUID via `crypto.randomUUID()`
- Timestamps: `createdAt`, `updatedAt` (mode: "date", defaultNow)

**API Routes (Next.js App Router):**
- CRUD: `/api/app/[entity-plural]/route.ts` (GET list, POST create)
- By ID: `/api/app/[entity-plural]/[id]/route.ts` (GET, PATCH, DELETE)
- Actions: `/api/app/[entity-plural]/[id]/[verb]/route.ts`
- AI chat: `/api/app/chat/route.ts` (POST — streamText)

**Files & Components:**
- Schema files: `src/db/schema/[entity-name].ts` (kebab-case)
- Components: `src/components/[category]/[name].tsx` (kebab-case)
- AI tools: `src/lib/ai/tools/[tool-name].ts` (kebab-case)
- Templates: `src/lib/ai/templates/[template-id].json`
- Hooks: `src/hooks/use-[name].ts` (kebab-case with use- prefix)

**Code (TypeScript):**
- Variables/functions: camelCase → `getUserWorkspaces()`, `chartConfig`
- Types/interfaces: PascalCase → `WorkspaceWithSources`, `ChartConfig`
- Constants: UPPER_SNAKE → `MAX_STEPS`, `MAX_FILE_SIZE_MB`
- Zod schemas: camelCase + Schema → `createWorkspaceSchema`

### API Response Patterns

**Success:** `{ data: T }` or `{ data: T[], total: number }` or `{ success: true }`
**Error:** `{ error: string, code: ErrorCode }` with appropriate HTTP status
**Error codes:** UNAUTHORIZED, FORBIDDEN, NOT_FOUND, QUOTA_EXCEEDED, VALIDATION_ERROR, CREDIT_EXHAUSTED, EXECUTION_TIMEOUT, CONNECTION_FAILED, AI_ERROR

### Auth Pattern

Every `/api/app/*` route uses `withAuthRequired` middleware. All DB queries scoped by `userId`.

### Credit/Quota Pattern

Check before expensive operations, deduct after success. Bundled per-message: 1 `ai_query` per user message, 1 `code_execution` per message that triggers any code.

### Agent Tool Pattern

Tools return structured results, NEVER throw. On error, return `{ error: "..." }` so the agent can self-correct. `maxSteps: 8`, `maxRetries: 2`.

### Error Handling

- API errors → `Response.json({ error, code }, { status })`
- Agent errors → return `{ error }` to agent (self-correction)
- User errors → conversational explanation
- System errors → Sentry capture + generic message
- Loading states → skeleton components (never spinners)

### Component Patterns

- Server Components by default (data fetching)
- Client Components with `"use client"` for interactivity
- `useChat` for AI streaming, SWR for data lists, React Context for UI state

### Anti-Patterns (NEVER)

- No `any` types — proper TypeScript always
- No direct DB queries in components — use API routes or server functions
- No client-side-only auth — always `withAuthRequired` server-side
- No `console.log` — use Sentry + structured logs
- No raw SQL strings — use Drizzle ORM
- No per-tool-call credits — bundled per message
- No throwing in tool functions — return error objects

## Project Structure & Boundaries

### Complete Project Directory Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── Providers.tsx
│   ├── robots.ts, sitemap.ts
│   │
│   ├── (website-layout)/                  # Public marketing pages
│   │   ├── layout.tsx
│   │   ├── page.tsx                       # Landing page
│   │   └── pricing/page.tsx
│   │
│   ├── (auth)/                            # Auth flows (existing)
│   │   ├── login/, register/, forgot-password/
│   │
│   ├── (public)/                          # Public shared views (Growth v1.5 stub)
│   │   └── shared/[token]/page.tsx        # Public report/chart view
│   │
│   ├── (in-app)/                          # Authenticated app
│   │   ├── layout.tsx
│   │   └── app/
│   │       ├── page.tsx                   # Dashboard (workspace list + stats)
│   │       ├── workspace/
│   │       │   ├── [id]/
│   │       │   │   ├── page.tsx           # Split-panel chat + visualization
│   │       │   │   ├── gallery/page.tsx   # Chart gallery
│   │       │   │   ├── sources/page.tsx   # Data sources management
│   │       │   │   ├── reports/page.tsx   # Generated reports view
│   │       │   │   └── settings/page.tsx  # Workspace settings (AI provider)
│   │       │   └── create/page.tsx
│   │       ├── templates/page.tsx         # Browse analysis templates
│   │       ├── settings/page.tsx          # User settings
│   │       └── billing/page.tsx           # Plan & credits
│   │
│   ├── api/
│   │   ├── app/
│   │   │   ├── chat/route.ts              # 🔥 Agentic AI (streamText + 10 tools)
│   │   │   ├── workspaces/
│   │   │   │   ├── route.ts               # GET list, POST create
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts           # GET, PATCH, DELETE
│   │   │   │       └── sources/route.ts
│   │   │   ├── data-sources/
│   │   │   │   ├── route.ts               # POST create
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts           # GET, DELETE
│   │   │   │       ├── test/route.ts      # POST test connection
│   │   │   │       ├── schema/route.ts    # GET introspect
│   │   │   │       └── upload/route.ts    # POST presigned URL
│   │   │   ├── conversations/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── charts/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── reports/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── templates/route.ts         # GET available templates
│   │   ├── auth/                          # (existing NextAuth)
│   │   ├── webhooks/                      # (existing payments)
│   │   ├── inngest/                       # (existing background jobs)
│   │   └── super-admin/                   # (existing admin API)
│   │
│   └── super-admin/                       # (existing admin pages)
│
├── lib/
│   ├── ai/                                # 🔥 Agentic AI core
│   │   ├── agent.ts                       # Agent config (system prompt, maxSteps, tools)
│   │   ├── providers.ts                   # OpenAI/Anthropic provider config
│   │   ├── tools/
│   │   │   ├── inspect-schema.ts          # Tool 1
│   │   │   ├── execute-sql.ts             # Tool 2
│   │   │   ├── execute-python.ts          # Tool 3
│   │   │   ├── render-chart.ts            # Tool 4
│   │   │   ├── profile-data.ts            # Tool 5
│   │   │   ├── analyze-results.ts         # Tool 6
│   │   │   ├── suggest-followups.ts       # Tool 7
│   │   │   ├── proactive-analysis.ts      # Tool 8
│   │   │   ├── apply-template.ts          # Tool 9
│   │   │   └── generate-report.ts         # Tool 10
│   │   ├── tools/__tests__/               # Tool unit tests
│   │   │   ├── inspect-schema.test.ts
│   │   │   ├── execute-sql.test.ts
│   │   │   ├── execute-python.test.ts
│   │   │   └── agent-integration.test.ts
│   │   ├── prompts/
│   │   │   ├── system.ts                  # Main builder (composes all parts)
│   │   │   ├── schema-context.ts          # Formats schema for AI context
│   │   │   ├── tool-guidelines.ts         # Tool usage rules
│   │   │   ├── safety-rules.ts            # SQL validation, forbidden patterns
│   │   │   └── template-hints.ts          # Column heuristic matching
│   │   └── templates/
│   │       ├── index.ts                   # Template registry + column matching
│   │       ├── ad-campaign.json           # 📊
│   │       ├── sales-kpi.json             # 📈
│   │       ├── financial-overview.json    # 💰
│   │       ├── ecommerce.json             # 🛒
│   │       ├── user-analytics.json        # 👥
│   │       ├── churn-retention.json       # 📉
│   │       └── operations.json            # ⚙️
│   │
│   ├── execution/                         # 🔥 Code execution engines
│   │   ├── duckdb.ts                      # DuckDB SQL (server-side, /tmp file cache)
│   │   ├── pyodide.ts                     # Pyodide Python (server-side)
│   │   ├── sql-validator.ts               # Read-only SQL validation
│   │   ├── sandbox-config.ts              # Timeout, memory, whitelists
│   │   └── __tests__/
│   │       ├── duckdb.test.ts
│   │       └── pyodide.test.ts
│   │
│   ├── connectors/                        # 🔥 Database connectors
│   │   ├── postgres.ts
│   │   ├── mysql.ts
│   │   ├── schema-introspector.ts
│   │   ├── connection-tester.ts
│   │   └── __tests__/
│   │       ├── postgres.test.ts
│   │       └── mysql.test.ts
│   │
│   ├── supabase/                          # 🔥 Supabase utilities
│   │   ├── client.ts                      # Supabase client instance
│   │   └── storage.ts                     # File upload/download helpers
│   │
│   ├── auth/                              # (existing)
│   ├── config.ts                          # (existing)
│   ├── credits/                           # (existing)
│   ├── encryption/                        # (existing AES-256)
│   ├── inngest/                           # (existing)
│   ├── plans/                             # (existing)
│   ├── stripe/                            # (existing)
│   └── ...                                # (other existing modules)
│
├── components/
│   ├── ui/                                # (existing 60+ shadcn)
│   ├── tailark/                           # (existing landing sections)
│   ├── layout/                            # (existing app layout)
│   ├── chat/                              # 🔥 Chat components
│   │   ├── chat-panel.tsx                 # Main chat with useChat
│   │   ├── message-bubble.tsx             # User/AI message
│   │   ├── code-block.tsx                 # Syntax-highlighted, edit/re-run
│   │   ├── tool-call-indicator.tsx        # Purple pulse during execution
│   │   ├── followup-chips.tsx             # Clickable follow-up suggestions
│   │   └── credit-counter.tsx             # Credits remaining
│   ├── visualization/                     # 🔥 Data viz
│   │   ├── chart-renderer.tsx             # Dynamic Recharts from AI config
│   │   ├── kpi-cards.tsx                  # KPI stat cards for reports
│   │   ├── data-table.tsx                 # Query results table
│   │   └── chart-gallery.tsx              # Saved charts grid
│   ├── workspace/                         # 🔥 Workspace
│   │   ├── workspace-card.tsx
│   │   ├── workspace-sidebar.tsx
│   │   ├── data-source-connector.tsx
│   │   ├── schema-preview.tsx
│   │   └── ai-provider-picker.tsx
│   └── reports/                           # 🔥 Reports
│       ├── report-viewer.tsx
│       ├── report-section.tsx
│       └── template-picker.tsx
│
├── db/
│   ├── index.ts                           # DB connection + all exports
│   └── schema/
│       ├── user.ts                        # (existing)
│       ├── plans.ts                       # (existing)
│       ├── workspaces.ts                  # (existing)
│       ├── data-sources.ts               # (existing)
│       ├── conversations.ts              # (existing)
│       ├── messages.ts                   # (existing)
│       ├── charts.ts                     # (existing)
│       └── reports.ts                    # 🆕 Saved reports
│
├── hooks/
│   ├── use-workspace.ts
│   ├── use-data-sources.ts
│   ├── use-conversations.ts
│   └── use-charts.ts
│
└── auth.ts                               # (existing NextAuth config)

tests/e2e/                                 # End-to-end tests
├── upload-to-chart.spec.ts
├── db-connection.spec.ts
├── template-execution.spec.ts
└── credit-exhaustion.spec.ts
```

### FR Category → Structure Mapping

| FR Category | Primary Locations |
|---|---|
| FR-1: Auth | `src/auth.ts`, `src/lib/auth/`, `src/app/(auth)/` |
| FR-2: Workspaces | `src/db/schema/workspaces.ts`, `src/app/api/app/workspaces/`, `src/app/(in-app)/app/workspace/` |
| FR-3: File Upload | `src/lib/supabase/storage.ts`, `src/app/api/app/data-sources/[id]/upload/` |
| FR-4: DB Connectors | `src/lib/connectors/`, `src/app/api/app/data-sources/[id]/test/` |
| FR-5: AI Chat + Intelligence | `src/lib/ai/` (agent, tools, prompts, templates), `src/app/api/app/chat/`, `src/components/chat/` |
| FR-6: Code Execution | `src/lib/execution/` (duckdb, pyodide, validator) |
| FR-7: Charts | `src/components/visualization/`, `src/db/schema/charts.ts` |
| FR-8: Plans & Quotas | `src/lib/plans/`, `src/lib/credits/` (existing) |
| FR-9: Landing | `src/app/(website-layout)/`, `src/components/tailark/` |
| FR-10: Super Admin | `src/app/super-admin/` (existing) |

### Architectural Boundaries

**API Boundaries:**
- All `/api/app/*` routes → authenticated, user-scoped
- `/api/app/chat` → agentic AI endpoint (streamText, SSE streaming)
- `/api/auth/*` → NextAuth handlers
- `/api/webhooks/*` → payment provider webhooks
- `/api/super-admin/*` → admin-only routes

**Data Boundaries:**
- Application data → Supabase PostgreSQL via Drizzle ORM
- User files → Supabase Storage (presigned uploads)
- External user DBs → `src/lib/connectors/` (read-only, encrypted credentials)
- Temporary execution data → `/tmp` during request lifecycle (DuckDB file cache)

**Component Boundaries:**
- Server Components → data fetching, layout
- Client Components → interactivity, `useChat`, SWR
- AI tools → server-only, never imported client-side
- Execution engines → server-only, sandboxed

### Data Flow

```
User Message → /api/app/chat (POST)
  → withAuthRequired
  → checkCredits("ai_query")
  → streamText({ model, tools, maxSteps: 8 })
    → Agent autonomously calls tools:
       inspect_schema → schema cache in DB
       execute_sql → download file from Supabase → /tmp cache → DuckDB query
                   → or live DB via connectors/ (read-only)
       execute_python → Pyodide server-side sandbox
       render_chart → chart config returned to client
       proactive_analysis → multi-tool insight chain
       apply_template → orchestrated tool sequence
       generate_report → assembled report sections
  → deductCredits (ai_query: 1, code_execution: 0 or 1)
  → Stream to client via SSE
Client:
  → useChat onMessage → text in chat bubble
  → useChat onToolCall → charts, code blocks, reports in right panel
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are compatible. Next.js 16 + Supabase PostgreSQL + Drizzle ORM + Vercel AI SDK + NextAuth v5 form a cohesive stack. Supabase Storage provides S3-compatible API for file operations. DuckDB server-side and Pyodide server-side both run within Vercel serverless functions (60s timeout). No version conflicts detected.

**Pattern Consistency:**
Naming conventions (camelCase DB, kebab-case files, PascalCase types) are consistent across all layers. API patterns follow existing Indie Kit conventions. The `withAuthRequired` + Zod validation + `{ data }` response pattern applies uniformly. Agent tool pattern (never throw, return `{ error }`) is consistent across all 10 tools.

**Structure Alignment:**
Project structure directly supports all architectural decisions. `src/lib/ai/` houses the complete agentic system. `src/lib/execution/` isolates sandboxed engines. `src/lib/connectors/` encapsulates external DB access. Boundaries between server-only modules (AI, execution, connectors) and client components (chat, visualization) are clearly defined.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
All 60+ FRs across 10 categories have clear architectural support:
- FR-1 through FR-4 (Auth, Workspaces, Upload, Connectors): Covered by existing Indie Kit patterns + Supabase extensions
- FR-5 (AI Chat, 19 FRs): Fully covered by agentic architecture — 10 tools, templates, proactive analysis, self-correction, follow-ups
- FR-6 (Code Execution, 11 FRs): DuckDB + Pyodide + SQL validator + sandbox config
- FR-7 (Charts, 7 FRs): Recharts + chart-renderer + gallery + save/export
- FR-8–FR-10: Existing Indie Kit systems (plans, credits, landing, admin)

**Non-Functional Requirements Coverage:**
- Performance (NFR-1): Streaming for first token <2s, DuckDB for SQL <10s, Pyodide for Python <30s
- Security (NFR-2): AES-256 credentials, SQL read-only validation, Pyodide sandbox, prompt injection defense
- Reliability (NFR-3): Agent self-correction (2 retries), Inngest retry for background jobs
- Scalability (NFR-4): Supabase scales PostgreSQL, Vercel scales serverless, stateless API design
- Observability (NFR-5): Sentry + structured AI metrics logging
- Accessibility (NFR-6): shadcn/Radix primitives provide WCAG 2.1 AA baseline
- Developer Experience (NFR-7): TypeScript strict, Zod validation, Drizzle migrations, co-located tests

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions are documented with specific versions, rationale, and implementation guidance. The 10-tool agent architecture is fully specified with categories, descriptions, and error handling patterns. Templates have defined structure (id, requiredColumns, steps, outputs).

**Structure Completeness:**
70+ files mapped in the directory tree. Every FR category maps to specific file locations. Integration points (API routes, tools, components) are clearly specified. Test directories defined for critical modules.

**Pattern Completeness:**
Naming conventions cover all layers (DB, API, files, code). Error handling has 4 tiers (API, agent, user, system). Anti-patterns explicitly listed. Credit deduction pattern documented (check before, deduct after, bundled per-message).

### Gap Analysis Results

| Gap | Priority | Resolution |
|---|---|---|
| Pyodide server-side Node.js feasibility | Medium | Validate in first sprint. Fallback: skip Python for MVP, add via Docker sidecar post-MVP |
| Reports DB schema not yet created | Low | Defined in structure, will create during implementation |
| Template JSON format detailed spec | Low | Define during template implementation stories |
| E2E test framework selection | Low | Playwright recommended, confirm during QA setup |
| DuckDB /tmp file cleanup timing | Low | Clean up at end of request via try/finally in execution module |

No critical gaps. All medium/low items have clear resolution paths.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (53+ FRs, 25+ NFRs)
- [x] Scale and complexity assessed (High — agentic AI + dual execution)
- [x] Technical constraints identified (Vercel timeouts, Supabase, WASM limits)
- [x] Cross-cutting concerns mapped (auth, credits, safety, observability)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions and rationale
- [x] Technology stack fully specified (14 major systems)
- [x] Integration patterns defined (agent tools, streaming, connectors)
- [x] Performance considerations addressed (streaming, caching, timeouts)

**✅ Implementation Patterns**
- [x] Naming conventions established across all layers
- [x] Structure patterns defined (API routes, components, hooks)
- [x] Communication patterns specified (SSE streaming, REST, tool calls)
- [x] Process patterns documented (error handling, credits, auth)

**✅ Project Structure**
- [x] Complete directory structure defined (70+ files)
- [x] Component boundaries established (server/client, AI/execution)
- [x] Integration points mapped (API → tools → engines → storage)
- [x] Requirements to structure mapping complete (10 FR categories)

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
- Agentic AI architecture is well-defined with clear tool boundaries and error handling
- Leverages 75% of existing Indie Kit infrastructure — minimal greenfield risk
- Proactive intelligence (templates, auto-analysis, reports) differentiates from simple chatbots
- Bundled credit model is user-friendly and implementation-simple
- Clear separation of concerns between AI, execution, connectors, and UI layers

**Areas for Future Enhancement:**
- Client-side DuckDB WASM for offline/privacy use cases (Growth phase)
- WebSocket real-time collaboration for Team plan (Growth phase)
- PDF report export (Growth v1.5)
- Public shared views (Growth v1.5)
- Supabase RLS policies as additional security layer
- Additional AI providers (Google Gemini, local models)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Tools NEVER throw — always return `{ error: "..." }` for agent self-correction

**First Implementation Priority:**
1. Supabase setup (connection string + storage config)
2. Install AI SDK packages (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`)
3. Create `/api/app/chat` route with `streamText()` + first 4 tools
4. Build split-panel chat UI with `useChat`
