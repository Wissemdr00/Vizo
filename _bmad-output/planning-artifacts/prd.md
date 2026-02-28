---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments: []
workflowType: 'prd'
classification:
  projectType: saas_b2b
  domain: scientific
  complexity: medium
  projectContext: brownfield
---

# Product Requirements Document — Vizo

**Author:** Wissem
**Date:** 2026-02-27

---

## Executive Summary

Vizo is an AI-powered data analytics platform that enables solo analysts to connect their data sources, ask questions in natural language, and receive instant insights through auto-generated SQL, Python code, and interactive visualizations. Users upload CSV/Excel files or connect to PostgreSQL/MySQL databases, then converse with an AI assistant that understands their data schema, generates executable queries, renders charts, and produces shareable reports — all without requiring the user to write code manually.

Vizo targets the growing gap between the data literacy demand and the technical barrier: analysts who understand their business domain but lack SQL/Python fluency, and technical analysts who want to accelerate repetitive query-and-visualize workflows. The platform operates as a SaaS web application with freemium monetization, credit-based usage for AI queries, and tiered subscription plans.

The existing codebase is built on Next.js 16 (React 19, TypeScript 5) with Drizzle ORM (PostgreSQL/Neon), NextAuth v5, Stripe/LemonSqueezy payments, S3 file uploads, Inngest background jobs, Recharts, and shadcn/ui. Bootstrap scaffolding is in place: workspace/data-source/conversation/message/chart DB schemas, landing page, credits system (ai_query, code_execution), and a dashboard shell.

### What Makes This Special

**AI-native analytics for non-technical analysts.** Unlike traditional BI tools (Tableau, Power BI) that require dashboard configuration expertise, or code notebooks (Jupyter) that require programming skills, Vizo lets users type plain-English questions and get immediate, accurate, visual answers. Every AI-generated result includes the underlying SQL or Python code, so technical users can verify, edit, and re-run — bridging the gap between no-code simplicity and full-code power.

**Multi-provider AI with user choice.** Users select their preferred LLM provider (OpenAI GPT-4o, Anthropic Claude, or future models) per workspace, avoiding vendor lock-in and letting analysts pick the model best suited to their data domain.

**Power BI MCP integration.** Vizo connects to Power BI via Model Context Protocol (MCP), enabling analysts to pull existing Power BI datasets and semantic models directly into Vizo's AI-powered conversational interface — combining Power BI's enterprise data layer with Vizo's natural-language analysis.

**Python + SQL dual execution.** Both SQL queries and Python scripts run in sandboxed environments against the user's data. The AI decides which language is optimal for the question and generates the appropriate code.

## Project Classification

- **Project Type:** SaaS Web Application (B2C/prosumer)
- **Domain:** Data Analytics / Scientific Computing
- **Complexity:** Medium — no regulatory compliance, but requires secure credential handling, sandboxed code execution, and multi-provider AI orchestration
- **Project Context:** Brownfield — built on Indie Kit boilerplate with existing auth, payments, credits, and UI infrastructure

---

## Success Criteria

### User Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Time from signup to first insight | < 3 minutes | Analytics: track signup → first AI response timestamp |
| Query-to-chart conversion rate | > 60% of AI responses include a visualization | Server logs: count responses with chart data |
| User retention (Week 1) | > 40% return within 7 days | Auth session tracking |
| Data source connection success rate | > 90% on first attempt | API error rate monitoring |
| Average AI response relevance | > 4.0/5.0 user rating | In-app thumbs up/down + optional rating |

### Business Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Free → Paid conversion rate | > 5% within 30 days | Stripe/payment provider data |
| Monthly Recurring Revenue (MRR) | $5K within 6 months of launch | Payment provider dashboard |
| Credit purchase rate (top-ups) | > 15% of paid users buy extra credits/month | Credits transaction logs |
| Churn rate | < 8% monthly for paid users | Subscription cancellation tracking |
| Organic signup rate | > 30% from shared analysis links | UTM/referrer tracking on shared links |

### Technical Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| AI response latency (streaming first token) | < 2 seconds | Server-side timing logs |
| SQL/Python execution time | < 10 seconds for 95th percentile | Execution engine timing |
| File upload + schema detection | < 5 seconds for files up to 50MB | Upload pipeline timing |
| API endpoint response time | < 500ms for CRUD operations | APM (Sentry) |
| Uptime | > 99.5% monthly | Vercel/infrastructure monitoring |

---

## User Journeys

### Journey 1: The First-Time Analyst ("Sarah's First Insight")

**Persona:** Sarah, 28, marketing analyst at a mid-size e-commerce company. Knows Excel well, has basic SQL knowledge, exports CSVs from internal tools daily. Frustrated by the time spent writing queries and making charts in Google Sheets.

**Journey:**
1. Sarah discovers Vizo from a shared analysis link a colleague posted on LinkedIn
2. She signs up with Google OAuth (< 10 seconds)
3. Vizo presents a "Welcome" screen: "Upload a file or connect a database to get started"
4. Sarah drags a `sales_q4_2025.csv` (12MB, 150K rows, 24 columns) onto the upload zone
5. Vizo uploads to S3, parses the file, infers schema (column names, types, null rates), and shows a preview table (first 100 rows) — all within 3 seconds
6. A workspace "My First Workspace" is auto-created with this data source attached
7. The chat interface opens. Sarah types: *"What were the top 10 products by revenue last quarter?"*
8. Vizo's AI reads the schema, generates a SQL query, executes it against the in-memory data, and streams back:
   - A natural language answer: "Here are the top 10 products by revenue..."
   - A bar chart showing products vs. revenue
   - The SQL query used (collapsible code block)
9. Sarah asks a follow-up: *"Break this down by month"*
10. Vizo generates a grouped bar chart with monthly breakdown, reusing context from the previous query
11. Sarah clicks "Save Chart" on the monthly breakdown and "Share" to generate a public link
12. She sends the link to her manager, who views the interactive chart without needing a Vizo account

**Success signal:** Sarah returns the next day with a new CSV.

### Journey 2: The Technical Analyst ("Omar's Database Deep-Dive")

**Persona:** Omar, 35, data analyst at a fintech startup. Fluent in SQL, some Python. Uses PostgreSQL daily. Wants to speed up ad-hoc queries and make them visual without context-switching to Tableau.

**Journey:**
1. Omar signs up, creates a workspace "Production Analytics"
2. He connects his company's read-replica PostgreSQL database:
   - Enters host, port, database, username, password
   - Vizo tests the connection, succeeds
   - Vizo introspects the schema: discovers 47 tables, indexes column names/types
3. Omar types: *"Show me the daily active users trend for the last 90 days"*
4. Vizo generates a SQL query against the `user_sessions` table, executes it on Omar's database (read-only, 30s timeout), and renders a line chart
5. Omar sees the SQL, notices it could be optimized, clicks "Edit Code"
6. He modifies the WHERE clause, clicks "Re-run" — the updated result appears instantly
7. Omar asks: *"Now correlate DAU with revenue per day — dual axis chart"*
8. Vizo generates a dual-axis line chart (DAU on left axis, revenue on right)
9. Omar switches to Python mode: *"Run a simple linear regression on DAU vs revenue and tell me the R² value"*
10. Vizo generates Python code (pandas + sklearn), executes in sandbox, returns: "R² = 0.73, indicating a moderate positive correlation" with a scatter plot + regression line
11. Omar saves the analysis as "DAU-Revenue Correlation Q4" and bookmarks the workspace

**Success signal:** Omar connects a second database (MySQL staging environment) and starts cross-referencing.

### Journey 3: The Excel Power User ("Fatima's File Library")

**Persona:** Fatima, 42, operations analyst at a logistics company. Expert Excel user, no SQL or Python. Manages 20+ spreadsheets across departments. Spends hours creating pivot tables and charts manually.

**Journey:**
1. Fatima signs up, creates workspace "Operations Q1 2026"
2. She uploads 5 Excel files (.xlsx): inventory, shipments, warehouse_costs, delivery_times, customer_complaints
3. Vizo parses each file (handling multiple sheets per workbook), infers schemas, shows previews
4. Fatima types: *"Which warehouses have the highest cost per shipment?"*
5. Vizo recognizes this requires joining warehouse_costs and shipments data, generates SQL that joins the two tables, and returns a horizontal bar chart ranked by cost/shipment
6. Fatima asks: *"Now show me if there's a correlation between delivery time and customer complaints by region"*
7. Vizo joins delivery_times and customer_complaints on region, generates a scatter plot with regions as data points, and adds a trend line
8. Fatima is amazed — this would have taken her 2 hours in Excel. She asks: *"Create a summary report of all 5 datasets"*
9. Vizo generates a structured overview: row counts, key metrics per dataset, potential join keys, and data quality notes (missing values, outliers)
10. Fatima upgrades from Free to Starter plan after exhausting her 20 free AI queries

**Success signal:** Fatima uploads files every Monday morning as part of her weekly workflow.

### Journey 4: Super Admin ("Managing the Platform")

**Persona:** Platform administrator (initially Wissem) managing Vizo's operations.

**Journey:**
1. Admin accesses `/super-admin` (protected by SUPER_ADMIN_EMAILS env var)
2. Dashboard shows: total users, active workspaces, AI queries today, credit usage, revenue
3. Admin can view user list, their plans, credit balances, and workspace counts
4. Admin manages subscription plans: create/edit plan names, quotas, pricing
5. Admin can impersonate a user to debug issues (existing Indie Kit feature)
6. Admin monitors system health: API latency, failed queries, error rates (Sentry integration)

---

## Domain Requirements

### Data Security & Privacy

- **Credential encryption:** Database connection strings and API keys encrypted at rest using AES-256 (via existing `src/lib/encryption/`)
- **Data residency:** User-uploaded files stored in S3 with configurable region. Raw data never persisted beyond the user's S3 bucket — only schema metadata stored in PostgreSQL
- **Query isolation:** Each user's SQL/Python executions run in isolated contexts. No cross-user data leakage
- **Connection security:** All database connections use TLS/SSL. Connection strings validated before storage
- **Data deletion:** When a user deletes a data source, the S3 file and all associated query results are permanently removed within 24 hours (Inngest background job)

### AI-Specific Requirements

- **Prompt injection defense:** User queries sanitized before inclusion in AI prompts. System prompts use delimiter-based separation to prevent user text from overriding instructions
- **Token budget management:** Conversation context limited to last 20 messages + full schema to prevent token overflow. Older messages summarized automatically
- **Model fallback:** If primary AI provider returns an error (rate limit, outage), system retries once, then falls back to secondary provider if configured
- **Generated code safety:** AI-generated SQL is validated as read-only (no INSERT/UPDATE/DELETE/DROP). Python code runs in a sandboxed environment with no filesystem/network access

### Sandboxed Code Execution

- **SQL sandbox:** Read-only mode enforced at the connection level (READ ONLY transaction for PostgreSQL/MySQL). For file-based data: in-memory DuckDB instance destroyed after query execution
- **Python sandbox:** Pyodide (Python WASM) running in an isolated worker with: no filesystem access, no network access, whitelisted packages only (pandas, numpy, sklearn, scipy, matplotlib), 30-second execution timeout, 256MB memory limit
- **Resource limits:** Max 10,000 rows returned per query. Max 50MB data loaded per execution context. 30-second timeout for all executions

---

## Innovation Analysis

### Competitive Landscape

| Competitor | Strengths | Weaknesses | Vizo Differentiator |
|---|---|---|---|
| **Julius.ai** | Polished AI chat, good file support, Python execution | No database connectors in free tier, limited chart customization, single AI provider | Multi-provider AI, Power BI MCP, database connectors from Day 1 |
| **Tableau** | Enterprise-grade visualization, data governance | Steep learning curve, expensive ($75/user/month), no AI-native querying | Natural language first, 10x faster for ad-hoc analysis, 10x cheaper |
| **Power BI** | Enterprise data modeling, DAX, Microsoft ecosystem | Complex setup, requires desktop app, limited AI capabilities | Web-native, no desktop app needed, AI-generated code visible and editable |
| **ChatGPT (Code Interpreter)** | Powerful Python execution, general knowledge | No persistent data connections, no workspace management, re-upload files every session | Persistent workspaces, saved analyses, database connectors, purpose-built for analytics |
| **Google Sheets + Gemini** | Familiar spreadsheet UI, free tier | Limited to spreadsheet paradigm, weak visualization, no SQL/Python | Professional-grade charts, SQL/Python code generation, database connectors |

### Vizo's Innovation Pillars

1. **Power BI MCP Integration** — First analytics AI to connect to Power BI's semantic layer via Model Context Protocol, letting analysts query enterprise Power BI datasets through natural language without learning DAX
2. **Multi-Provider AI** — Users choose their LLM per workspace (OpenAI, Anthropic, future: Mistral, Llama). No vendor lock-in, users pick the model best suited to their data domain
3. **Code Transparency** — Every AI response shows the generated SQL/Python. Users can edit and re-run. This builds trust (analysts can verify) and educates (learning SQL/Python through use)
4. **Workspace Persistence** — Unlike ChatGPT which loses context between sessions, Vizo maintains persistent workspaces with connected data sources, conversation history, and saved charts

---

## Project-Type Requirements (SaaS Web App)

### Multi-Tenancy

- Single-database multi-tenancy with row-level isolation (userId on workspaces, cascading to all child entities)
- No shared data between users — every query scoped by authenticated userId
- Workspace-level data isolation: data sources, conversations, messages, charts all scoped to workspace

### Subscription & Billing

- **Payment providers:** Stripe (primary), LemonSqueezy, Dodo, Paddle, PayPal (all pre-configured in Indie Kit)
- **Plan structure:** 4 tiers (Free, Starter, Pro, Team) with monthly/yearly billing
- **Credit system:** ai_query credits (consumed per AI message), code_execution credits (consumed per code run). Credits included in plans + purchasable separately
- **Quota enforcement:** Server-side middleware checks plan quotas before workspace creation, data source connection, and AI query execution

### Authentication & Authorization

- **Auth providers:** Google OAuth (primary), Magic Link (email), Credentials (email/password) — all pre-configured
- **Session management:** NextAuth v5 with JWT sessions
- **API protection:** All `/api/app/*` routes require authenticated session. All workspace operations verify userId ownership
- **Super admin:** SUPER_ADMIN_EMAILS env var grants access to `/super-admin` panel

### Real-Time & Streaming

- **AI response streaming:** Vercel AI SDK `streamText()` for token-by-token rendering in the chat UI
- **No WebSocket requirement for MVP:** Streaming uses HTTP SSE (Server-Sent Events) via AI SDK. WebSockets reserved for future real-time collaboration

---

## Product Scope

### MVP (v1.0) — "Talk to Your Data"

Core experience: Upload files or connect databases → ask AI questions → get answers with charts and code.

**In Scope:**
- User authentication (Google, Magic Link, Email/Password)
- Workspace CRUD (create, rename, delete)
- File upload data sources: CSV, Excel (.xlsx with multi-sheet), JSON
- Database connectors: PostgreSQL, MySQL (connection form, test, schema introspection)
- AI chat interface with streaming responses
- Multi-provider AI: OpenAI GPT-4o, Anthropic Claude (user selects per workspace)
- SQL code generation and execution (read-only, sandboxed)
- Python code generation and execution (Pyodide sandbox, whitelisted packages)
- Auto-generated charts: bar, line, area, scatter, pie, donut, table
- Chart save and gallery within workspace
- Conversation history with message persistence
- Credit system: ai_query, code_execution (included in plans + purchasable)
- 4 subscription plans: Free, Starter, Pro, Team
- Landing page, pricing page, auth flows
- In-app dashboard with workspace list and quick actions
- Super admin panel (user management, plan management)

**Out of Scope for MVP:**
- Power BI MCP integration
- Cloud connectors (Google Sheets, Airtable, Notion, BigQuery, Snowflake, Redshift)
- Public share links for analyses
- Team collaboration / shared workspaces
- Report generation / PDF export
- Chart export (PNG/SVG)
- Scheduled/recurring queries
- Onboarding wizard
- Custom chart theming
- Mobile-responsive chat interface (desktop-first)

### Growth (v1.5) — "Connect Everything"

- Power BI MCP integration (query Power BI datasets via natural language)
- Cloud connectors: Google Sheets, Airtable, REST API
- Public share links (view-only link for any conversation or chart)
- Chart export as PNG/SVG
- Data export as CSV
- Onboarding wizard (guided first experience)
- Mobile-responsive chat interface
- Scheduled queries (Inngest cron: run a query daily/weekly, email results)
- Report generation (structured multi-chart document from conversation)

### Vision (v2.0+) — "Your Data Team in a Box"

- Team workspaces with role-based access (owner, editor, viewer)
- Enterprise connectors: BigQuery, Snowflake, Redshift, MongoDB, Notion
- Dashboard builder (pin multiple charts to a grid layout)
- Custom AI agents per workspace (user-defined system prompts)
- Data transformation pipelines (clean, join, aggregate as repeatable workflows)
- Version history for queries and charts
- API access (programmatic access to Vizo's analysis engine)
- White-label / embedded analytics (Vizo as a component inside other apps)
- SOC 2 compliance

---

## Functional Requirements

### FR-1: Authentication & User Management

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-1.1 | Users can sign up and log in via Google OAuth, Magic Link (email), or email/password | MVP | Journey 1 step 2 |
| FR-1.2 | Users can view and edit their profile (name, email, avatar) | MVP | Journey 4 |
| FR-1.3 | Users can view their current plan, quotas, and credit balances | MVP | Journey 3 step 10 |
| FR-1.4 | Users can upgrade, downgrade, or cancel their subscription plan | MVP | Journey 3 step 10 |
| FR-1.5 | Users can purchase additional credit packs (ai_query, code_execution) | MVP | Business metrics |
| FR-1.6 | System deactivates user sessions on password change | MVP | Security |

### FR-2: Workspace Management

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-2.1 | Users can create a workspace with a name and optional description | MVP | Journey 1 step 6 |
| FR-2.2 | Users can rename or delete a workspace | MVP | Workspace lifecycle |
| FR-2.3 | Users can view a list of all their workspaces with data source count, conversation count, and last activity timestamp | MVP | Dashboard |
| FR-2.4 | System enforces `maxWorkspaces` quota per user plan before allowing creation | MVP | Plans |
| FR-2.5 | Workspace deletion cascades to all data sources, conversations, messages, and charts within that workspace | MVP | Data integrity |
| FR-2.6 | System auto-creates a default workspace named "My First Workspace" on first data source upload if no workspace exists | MVP | Journey 1 step 6 |

### FR-3: File Upload Data Sources

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-3.1 | Users can upload CSV files (up to plan's `maxFileUploadSizeMb` limit) via drag-and-drop or file picker | MVP | Journey 1 step 4 |
| FR-3.2 | Users can upload Excel files (.xlsx) with automatic multi-sheet detection; user selects which sheet(s) to import | MVP | Journey 3 step 2 |
| FR-3.3 | Users can upload JSON files (array-of-objects format) | MVP | Data flexibility |
| FR-3.4 | System uploads files to S3 via presigned URL, then parses and infers schema: column names, data types (string, number, date, boolean), null percentage, row count, and sample values | MVP | Journey 1 step 5 |
| FR-3.5 | System displays a preview table showing the first 100 rows after upload, within 5 seconds for files up to 50MB | MVP | Journey 1 step 5 |
| FR-3.6 | System enforces `maxDataSources` quota per user plan before allowing upload | MVP | Plans |
| FR-3.7 | System enforces `maxFileUploadSizeMb` and rejects files exceeding the limit with a clear error message stating the limit | MVP | Plans |
| FR-3.8 | Users can delete a data source, which removes the S3 file and all associated metadata within 24 hours | MVP | Data deletion |

### FR-4: Database Connectors

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-4.1 | Users can connect a PostgreSQL database by providing: host, port, database name, username, password, and optional SSL toggle | MVP | Journey 2 step 2 |
| FR-4.2 | Users can connect a MySQL database by providing: host, port, database name, username, password | MVP | Scope |
| FR-4.3 | System tests the database connection before saving and displays success/failure with error details | MVP | Journey 2 step 2 |
| FR-4.4 | System introspects the connected database schema: table names, column names, column types, primary keys, foreign keys, and row count estimates | MVP | Journey 2 step 2 |
| FR-4.5 | Database credentials are encrypted at rest using AES-256 before storage | MVP | Domain: security |
| FR-4.6 | All database connections use TLS/SSL when available | MVP | Domain: security |
| FR-4.7 | System enforces `maxDataSources` quota before allowing new connection | MVP | Plans |
| FR-4.8 | Users can refresh (re-introspect) a database schema to pick up table/column changes | MVP | Schema evolution |
| FR-4.9 | Users can disconnect (delete) a database data source, removing stored credentials and metadata | MVP | Data lifecycle |

### FR-5: AI Chat & Analysis

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-5.1 | Users can create a new conversation within a workspace, optionally selecting specific data source(s) to focus the analysis | MVP | Journey 1 step 7 |
| FR-5.2 | Users can type natural-language questions and receive AI-generated responses streamed token-by-token in < 2 seconds to first token | MVP | Journey 1 step 8 |
| FR-5.3 | AI responses include: natural language explanation, generated code (SQL or Python), execution results (data table or scalar), and auto-suggested visualization when applicable | MVP | Journey 1 step 8 |
| FR-5.4 | Users can select their preferred AI provider (OpenAI GPT-4o or Anthropic Claude) per workspace via workspace settings | MVP | Innovation |
| FR-5.5 | System builds AI context from: full data source schema(s), conversation history (last 20 messages), and workspace metadata | MVP | AI quality |
| FR-5.6 | System deducts 1 `ai_query` credit per user message that triggers an AI response | MVP | Credits |
| FR-5.7 | System displays a "You've used X of Y credits" indicator in the chat interface and blocks queries when credits are exhausted, with a link to purchase more | MVP | Credits |
| FR-5.8 | Users can view full conversation history within a workspace, with conversations listed by title and last activity date | MVP | Journey 2 step 11 |
| FR-5.9 | System auto-generates conversation titles from the first user message (AI-summarized to < 50 characters) | MVP | UX |
| FR-5.10 | Users can rename or delete conversations | MVP | Workspace management |

### FR-6: Code Generation & Execution

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-6.1 | AI generates SQL queries for data retrieval questions against file-based and database data sources | MVP | Journey 1 step 8 |
| FR-6.2 | AI generates Python code (pandas, numpy, sklearn, scipy) for statistical analysis, data transformation, and machine learning tasks | MVP | Journey 2 step 9 |
| FR-6.3 | AI selects the appropriate language (SQL or Python) based on the question type. Statistical/ML questions → Python. Data retrieval/aggregation → SQL | MVP | AI quality |
| FR-6.4 | Generated SQL is validated as read-only before execution: no INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, or GRANT statements allowed | MVP | Domain: security |
| FR-6.5 | Users can view the generated code in a syntax-highlighted, collapsible code block with a copy-to-clipboard button | MVP | Journey 2 step 5 |
| FR-6.6 | Users can edit generated code in-place and click "Re-run" to execute the modified version | MVP | Journey 2 step 6 |
| FR-6.7 | SQL execution for file-based data uses in-memory DuckDB: data loaded, query executed, instance destroyed | MVP | Domain: sandbox |
| FR-6.8 | SQL execution for database data sources runs against the live connection with READ ONLY transaction mode, 30-second timeout, and 10,000 row limit | MVP | Domain: sandbox |
| FR-6.9 | Python execution runs in Pyodide (WASM) with: no filesystem access, no network access, whitelisted packages, 30-second timeout, 256MB memory limit | MVP | Domain: sandbox |
| FR-6.10 | System deducts 1 `code_execution` credit per code execution (SQL or Python) | MVP | Credits |
| FR-6.11 | Execution results are displayed as: data tables (up to 10,000 rows with pagination), scalar values, or error messages with the specific error text | MVP | UX |

### FR-7: Visualization & Charts

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-7.1 | AI auto-selects the optimal chart type based on the query result shape: single metric → stat card, category + value → bar chart, time series → line chart, two numeric columns → scatter plot, proportions → pie chart, matrix → heatmap | MVP | Journey 1 step 8 |
| FR-7.2 | System renders interactive charts using Recharts with: hover tooltips, axis labels, legend, and responsive sizing | MVP | UX |
| FR-7.3 | Supported chart types: bar (vertical/horizontal), line, area, scatter, pie, donut, and data table | MVP | Feature set |
| FR-7.4 | Users can save any chart to the workspace chart gallery with a custom title | MVP | Journey 1 step 11 |
| FR-7.5 | Users can view all saved charts in a gallery grid within the workspace | MVP | Journey 2 step 11 |
| FR-7.6 | Users can delete saved charts from the gallery | MVP | Workspace management |
| FR-7.7 | Charts render within 1 second of receiving execution results for datasets up to 10,000 rows | MVP | Performance |

### FR-8: Plans & Quotas

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-8.1 | System offers 4 subscription plans with the following quotas: | MVP | Business model |

**Plan Matrix:**

| Quota | Free | Starter ($19/mo) | Pro ($49/mo) | Team ($99/mo) |
|---|---|---|---|---|
| Monthly AI Queries | 20 | 200 | 1,000 | 5,000 |
| Max Data Sources | 2 | 10 | 50 | Unlimited |
| Max Workspaces | 1 | 5 | 20 | Unlimited |
| Max File Upload Size | 5 MB | 25 MB | 100 MB | 500 MB |
| Code Execution | ❌ | ✅ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| AI Providers | OpenAI only | All | All | All |
| Database Connectors | ❌ | ✅ | ✅ | ✅ |

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-8.2 | System allocates plan credits on subscription start and renewal: Starter (100 ai_query + 50 code_execution), Pro (500 + 300), Team (2000 + 1000) | MVP | Credits |
| FR-8.3 | Users can purchase additional credit packs: ai_query at $0.02/credit (< 500) or $0.015/credit (500+), code_execution at $0.01/credit | MVP | Credits |
| FR-8.4 | System blocks operations that exceed plan quotas with clear error messages stating the limit and linking to the upgrade page | MVP | Enforcement |
| FR-8.5 | Pricing page displays all plans with feature comparison and monthly/annual toggle (annual = 2 months free) | MVP | Conversion |

### FR-9: Landing Page & Marketing

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-9.1 | Landing page includes: hero section ("Your Data Analyst, Powered by AI"), features grid (6 features), stats section, pricing comparison, testimonials, FAQ, and CTA | MVP | Existing |
| FR-9.2 | FAQ section answers: supported data sources, SQL/Python requirement, data security, credit system, sharing capabilities | MVP | Existing |
| FR-9.3 | SEO-optimized metadata: title, description, Open Graph tags, sitemap | MVP | Growth |

### FR-10: Super Admin

| ID | Requirement | Priority | Trace |
|---|---|---|---|
| FR-10.1 | Admin can view all users with: email, plan, signup date, workspace count, query count, credit balance | MVP | Journey 4 |
| FR-10.2 | Admin can manage subscription plans: create, edit name/quotas/pricing, set default plan | MVP | Journey 4 |
| FR-10.3 | Admin can impersonate any user for debugging purposes (existing Indie Kit feature) | MVP | Journey 4 |
| FR-10.4 | Admin dashboard shows: total users, active users (7d), total workspaces, queries today, MRR | MVP | Journey 4 |

---

## Non-Functional Requirements

### NFR-1: Performance

| ID | Requirement | Measurement |
|---|---|---|
| NFR-1.1 | CRUD API endpoints respond in < 500ms for 95th percentile under normal load (< 100 concurrent users) | Sentry APM |
| NFR-1.2 | AI streaming delivers first token in < 2 seconds for 95th percentile | Server-side timing |
| NFR-1.3 | File upload + schema inference completes in < 5 seconds for files up to 50MB | Upload pipeline logs |
| NFR-1.4 | SQL query execution completes in < 10 seconds for 95th percentile (file-based and database) | Execution engine logs |
| NFR-1.5 | Python code execution completes in < 30 seconds (hard timeout) with 256MB memory limit | Pyodide worker metrics |
| NFR-1.6 | Chart rendering completes in < 1 second for datasets up to 10,000 rows | Client-side performance marks |
| NFR-1.7 | Landing page achieves Lighthouse Performance score > 85 | Lighthouse CI |

### NFR-2: Security

| ID | Requirement | Measurement |
|---|---|---|
| NFR-2.1 | Database credentials encrypted at rest using AES-256 via existing encryption module | Code review + penetration test |
| NFR-2.2 | All API routes under `/api/app/*` require valid authenticated session; unauthorized requests return 401 | Automated API test suite |
| NFR-2.3 | SQL injection prevented: all user inputs parameterized in database queries. AI-generated SQL validated for read-only operations | Static analysis + penetration test |
| NFR-2.4 | AI prompt injection mitigated: user input delimited with markers in system prompts; AI output validated before execution | Red team testing |
| NFR-2.5 | File uploads validated: MIME type checking, file extension whitelist (csv, xlsx, json), file size enforcement | Upload handler tests |
| NFR-2.6 | Python sandbox prevents: filesystem access, network access, process spawning, imports outside whitelist | Sandbox escape testing |
| NFR-2.7 | HTTPS enforced on all routes via Vercel deployment | Infrastructure config |

### NFR-3: Reliability & Availability

| ID | Requirement | Measurement |
|---|---|---|
| NFR-3.1 | System maintains > 99.5% uptime during any 30-day period | Vercel status + uptime monitor |
| NFR-3.2 | AI provider failure triggers 1 automatic retry, then graceful error message to user (not a generic 500) | Error handling tests |
| NFR-3.3 | File upload failure (S3 error) retries up to 2 times before displaying user-friendly error with retry button | Upload handler tests |
| NFR-3.4 | Database connection timeout (5 seconds for test, 30 seconds for queries) with clear timeout error message | Connection handler tests |
| NFR-3.5 | Background jobs (credit expiry, data cleanup) execute via Inngest with automatic retry (3 attempts, exponential backoff) | Inngest dashboard |

### NFR-4: Scalability

| ID | Requirement | Measurement |
|---|---|---|
| NFR-4.1 | System supports up to 1,000 concurrent authenticated users without degradation | Load testing |
| NFR-4.2 | Database supports up to 100,000 workspaces and 1M conversations without query degradation (indexed on userId, workspaceId) | Database benchmarking |
| NFR-4.3 | File storage scales independently via S3 with no upper limit | S3 architecture |
| NFR-4.4 | AI query load distributed across multiple provider API keys when rate-limited | Provider failover logs |

### NFR-5: Observability

| ID | Requirement | Measurement |
|---|---|---|
| NFR-5.1 | All server errors captured and reported via Sentry with user context (userId, workspaceId, route) | Sentry dashboard |
| NFR-5.2 | AI query metrics logged: provider, model, input tokens, output tokens, latency, success/failure | Structured logs |
| NFR-5.3 | Code execution metrics logged: language, execution time, memory usage, success/failure, error type | Structured logs |
| NFR-5.4 | Business metrics queryable: signups/day, queries/day, credit usage, conversion funnel | Analytics queries on production DB |

### NFR-6: Accessibility & Browser Support

| ID | Requirement | Measurement |
|---|---|---|
| NFR-6.1 | WCAG 2.1 Level AA compliance for all interactive elements (forms, buttons, navigation) | axe-core automated testing |
| NFR-6.2 | Keyboard navigation support for chat interface, workspace management, and data source forms | Manual QA checklist |
| NFR-6.3 | Supported browsers: Chrome (last 2 versions), Firefox (last 2 versions), Safari (last 2 versions), Edge (last 2 versions) | Cross-browser testing |

### NFR-7: Developer Experience

| ID | Requirement | Measurement |
|---|---|---|
| NFR-7.1 | TypeScript strict mode enforced across all source files (zero `any` types in new code) | TypeScript compiler + ESLint |
| NFR-7.2 | All API routes have Zod validation schemas for request/response | Code review |
| NFR-7.3 | Database schema changes managed via Drizzle migrations with rollback support | Migration test |
| NFR-7.4 | Environment variables documented in `.env` template with descriptions | Documentation review |

---

## Technical Constraints & Assumptions

### Constraints
- **Runtime:** Vercel serverless functions (10-second default timeout, 60-second max for Pro). Long-running analyses use Inngest background functions
- **Database:** Single PostgreSQL instance (Neon) for application data. User databases connected as external read-only sources
- **File storage:** AWS S3 for user-uploaded files. No server-side file system persistence
- **AI providers:** OpenAI and Anthropic APIs. Both require API keys configured server-side. Users do not provide their own API keys
- **Python execution:** Pyodide (WASM) runs client-side or in a Vercel Edge function. Not server-side Node.js

### Assumptions
- Users have access to at least one data source (file or database) to derive value from the product
- AI model pricing remains approximately stable ($0.01-$0.03 per 1K input tokens for GPT-4o class models)
- DuckDB WASM is sufficiently performant for in-memory SQL on files up to 100MB
- Pyodide loads within 3-5 seconds on first use (acceptable one-time cost)
- Users accept that AI-generated answers may occasionally be inaccurate and use code transparency to verify

---

## Glossary

| Term | Definition |
|---|---|
| **Workspace** | A container that groups data sources, conversations, and charts for a specific analysis project |
| **Data Source** | A connected source of data — either an uploaded file (CSV/Excel/JSON) or a database connection (PostgreSQL/MySQL) |
| **Conversation** | An AI chat session within a workspace where the user asks questions about their data |
| **Message** | A single exchange in a conversation — either a user question or an AI response (with optional code and charts) |
| **Chart** | A saved visualization generated from query results |
| **Credit** | A unit of usage consumed when performing AI queries (`ai_query`) or code executions (`code_execution`) |
| **MCP** | Model Context Protocol — a standard for connecting AI models to external tools and data sources |
| **DuckDB** | An in-memory analytical SQL database used to query file-based data sources |
| **Pyodide** | A Python runtime compiled to WebAssembly, enabling sandboxed Python execution in the browser or edge functions |
| **Schema Introspection** | The process of automatically discovering table names, column names, and data types from a connected database |
