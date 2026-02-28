---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# Vizo - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Vizo, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1.1: Users can sign up and log in via Google OAuth, Magic Link (email), or email/password
FR-1.2: Users can view and edit their profile (name, email, avatar)
FR-1.3: Users can view their current plan, quotas, and credit balances
FR-1.4: Users can upgrade, downgrade, or cancel their subscription plan
FR-1.5: Users can purchase additional credit packs (ai_query, code_execution)
FR-1.6: System deactivates user sessions on password change

FR-2.1: Users can create a workspace with a name and optional description
FR-2.2: Users can rename or delete a workspace
FR-2.3: Users can view a list of all their workspaces with data source count, conversation count, and last activity timestamp
FR-2.4: System enforces maxWorkspaces quota per user plan before allowing creation
FR-2.5: Workspace deletion cascades to all data sources, conversations, messages, and charts within that workspace
FR-2.6: System auto-creates a default workspace named "My First Workspace" on first data source upload if no workspace exists

FR-3.1: Users can upload CSV files (up to plan's maxFileUploadSizeMb limit) via drag-and-drop or file picker
FR-3.2: Users can upload Excel files (.xlsx) with automatic multi-sheet detection; user selects which sheet(s) to import
FR-3.3: Users can upload JSON files (array-of-objects format)
FR-3.4: System uploads files to Supabase Storage via presigned URL, then parses and infers schema: column names, data types, null percentage, row count, and sample values
FR-3.5: System displays a preview table showing the first 100 rows after upload, within 5 seconds for files up to 50MB
FR-3.6: System enforces maxDataSources quota per user plan before allowing upload
FR-3.7: System enforces maxFileUploadSizeMb and rejects files exceeding the limit with a clear error message
FR-3.8: Users can delete a data source, which removes the storage file and all associated metadata within 24 hours

FR-4.1: Users can connect a PostgreSQL database by providing: host, port, database name, username, password, and optional SSL toggle
FR-4.2: Users can connect a MySQL database by providing: host, port, database name, username, password
FR-4.3: System tests the database connection before saving and displays success/failure with error details
FR-4.4: System introspects the connected database schema: table names, column names, column types, primary keys, foreign keys, and row count estimates
FR-4.5: Database credentials are encrypted at rest using AES-256 before storage
FR-4.6: All database connections use TLS/SSL when available
FR-4.7: System enforces maxDataSources quota before allowing new connection
FR-4.8: Users can refresh (re-introspect) a database schema to pick up table/column changes
FR-4.9: Users can disconnect (delete) a database data source, removing stored credentials and metadata

FR-5.1: Users can create a new conversation within a workspace, optionally selecting specific data source(s) to focus the analysis
FR-5.2: Users can type natural-language questions and receive AI-generated responses streamed token-by-token in < 2 seconds to first token
FR-5.3: AI agent autonomously selects and chains tools (schema inspection, SQL execution, Python execution, charting, data profiling) to answer questions in 1-8 steps per user message
FR-5.4: Users can select their preferred AI provider (OpenAI GPT-4o or Anthropic Claude) per workspace via workspace settings
FR-5.5: System builds AI agent context from: full data source schema(s), conversation history (last 20 messages), tool call history within current turn, previous tool results, and workspace metadata
FR-5.6: System deducts 1 ai_query credit per user message that triggers an AI response. All tool calls within the agent loop for that message are included
FR-5.7: System displays a credit indicator in the chat interface and blocks queries when credits are exhausted
FR-5.8: Users can view full conversation history within a workspace, with conversations listed by title and last activity date
FR-5.9: System auto-generates conversation titles from the first user message (AI-summarized to < 50 characters)
FR-5.10: Users can rename or delete conversations
FR-5.11: AI agent self-corrects on tool errors — retries with modified approach up to 2 times before surfacing error to user
FR-5.12: AI agent generates 3 contextual follow-up question suggestions after each response, displayed as clickable chips
FR-5.13: AI agent auto-profiles data sources on first query in a conversation if schema hasn't been inspected yet
FR-5.14: AI agent proactively analyzes new data sources on upload: identifies distributions, outliers, correlations, data quality issues, and suggests 3-5 key insights
FR-5.15: AI agent suggests chart types based on data shape and query results as clickable options
FR-5.16: System includes 7 pre-built Analysis Templates for common business domains
FR-5.17: AI agent detects which template matches uploaded data via column name heuristics and suggests running it
FR-5.18: Templates generate multi-chart reports with KPI cards, trend charts, rankings, anomaly detection, and recommendations
FR-5.19: Generated reports are saveable and viewable in a dedicated report view within the workspace

FR-6.1: AI generates SQL queries for data retrieval questions against file-based and database data sources
FR-6.2: AI generates Python code (pandas, numpy, sklearn, scipy) for statistical analysis and ML tasks
FR-6.3: AI agent selects SQL, Python, or both in sequence based on question complexity autonomously
FR-6.4: Generated SQL is validated as read-only before execution
FR-6.5: Users can view the generated code in a syntax-highlighted, collapsible code block with copy button
FR-6.6: Users can edit generated code in-place and click Re-run to execute the modified version
FR-6.7: SQL execution for file-based data uses in-memory DuckDB: data loaded, query executed, instance destroyed
FR-6.8: SQL execution for database sources runs against live connection with READ ONLY transaction, 30s timeout, 10K row limit
FR-6.9: Python execution runs in Pyodide (WASM) with sandbox restrictions
FR-6.10: Code executions within an agent loop are bundled: 1 code_execution credit per user message
FR-6.11: Execution results displayed as data tables (up to 10K rows with pagination), scalar values, or error messages

FR-7.1: AI auto-selects optimal chart type based on query result shape
FR-7.2: System renders interactive charts using Recharts with tooltips, axis labels, legend, responsive sizing
FR-7.3: Supported chart types: bar, line, area, scatter, pie, donut, and data table
FR-7.4: Users can save any chart to the workspace chart gallery with a custom title
FR-7.5: Users can view all saved charts in a gallery grid within the workspace
FR-7.6: Users can delete saved charts from the gallery
FR-7.7: Charts render within 1 second for datasets up to 10,000 rows

FR-8.1: System offers 4 subscription plans (Free, Starter $19, Pro $49, Team $99) with defined quotas
FR-8.2: System allocates plan credits on subscription start and renewal
FR-8.3: Users can purchase additional credit packs
FR-8.4: System blocks operations that exceed plan quotas with clear error messages
FR-8.5: Pricing page displays all plans with feature comparison and monthly/annual toggle

FR-9.1: Landing page includes hero section, features grid, stats, pricing, testimonials, FAQ, and CTA
FR-9.2: FAQ section answers key questions about the platform
FR-9.3: SEO-optimized metadata: title, description, Open Graph tags, sitemap

FR-10.1: Admin can view all users with plan, signup date, workspace count, query count, credit balance
FR-10.2: Admin can manage subscription plans: create, edit name/quotas/pricing, set default plan
FR-10.3: Admin can impersonate any user for debugging (existing Indie Kit feature)
FR-10.4: Admin dashboard shows total users, active users, total workspaces, queries today, MRR

### NonFunctional Requirements

NFR-1.1: CRUD API endpoints respond in < 500ms for 95th percentile
NFR-1.2: AI streaming delivers first token in < 2 seconds for 95th percentile
NFR-1.3: File upload + schema inference completes in < 5 seconds for files up to 50MB
NFR-1.4: SQL query execution completes in < 10 seconds for 95th percentile
NFR-1.5: Python code execution completes in < 30 seconds with 256MB memory limit
NFR-1.6: Chart rendering completes in < 1 second for datasets up to 10,000 rows
NFR-1.7: Landing page Lighthouse Performance score > 85

NFR-2.1: Database credentials encrypted at rest using AES-256
NFR-2.2: All /api/app/* routes require valid authenticated session
NFR-2.3: SQL injection prevented: parameterized queries, AI SQL validated read-only
NFR-2.4: AI prompt injection mitigated: delimited system prompts, sanitized input
NFR-2.5: File uploads validated: MIME type, extension whitelist, size enforcement
NFR-2.6: Python sandbox prevents filesystem, network, process spawning, unauthorized imports
NFR-2.7: HTTPS enforced on all routes via Vercel

NFR-3.1: System maintains > 99.5% uptime per 30-day period
NFR-3.2: AI provider failure triggers retry then graceful error message
NFR-3.3: File upload failure retries up to 2 times before user-friendly error
NFR-3.4: Database connection timeout (5s test, 30s queries) with clear messages
NFR-3.5: Background jobs via Inngest with automatic retry (3 attempts, exponential backoff)

NFR-4.1: Supports 1,000 concurrent authenticated users
NFR-4.2: Database supports 100K workspaces and 1M conversations
NFR-4.3: File storage scales independently via Supabase Storage
NFR-4.4: AI load distributed across multiple API keys when rate-limited

NFR-5.1: All server errors captured via Sentry with user context
NFR-5.2: AI query metrics logged: provider, model, tokens, latency, success/failure
NFR-5.3: Code execution metrics logged: language, time, memory, success/failure
NFR-5.4: Business metrics queryable: signups, queries, credits, conversion funnel

NFR-6.1: WCAG 2.1 Level AA compliance for all interactive elements
NFR-6.2: Keyboard navigation for chat, workspace management, data source forms
NFR-6.3: Cross-browser support: Chrome, Firefox, Safari, Edge (last 2 versions)

NFR-7.1: TypeScript strict mode enforced (zero any types in new code)
NFR-7.2: All API routes have Zod validation schemas
NFR-7.3: Database schema changes via Drizzle migrations with rollback
NFR-7.4: Environment variables documented in .env template

### Additional Requirements

**From Architecture:**
- Brownfield on Indie Kit — 75% infrastructure ready, extend not replace
- Supabase PostgreSQL replaces Neon, Supabase Storage replaces S3
- Vercel AI SDK agentic loop with streamText() + 10 custom tools + maxSteps: 8
- 7 analysis templates as JSON configs in src/lib/ai/templates/
- Proactive intelligence: auto-analysis on upload, template detection via column heuristics
- DuckDB runs server-side (API route), not client-side WASM
- Pyodide runs server-side (API route), not client-side WASM
- Split prompts directory: system.ts, schema-context.ts, tool-guidelines.ts, safety-rules.ts, template-hints.ts
- Reports DB schema (reports.ts) needs to be created
- Co-located __tests__/ directories for ai/tools, execution, connectors
- E2E tests: upload-to-chart, db-connection, template-execution, credit-exhaustion
- Templates browse page (templates/page.tsx)
- Public shared view stub (shared/[token]/page.tsx) for Growth v1.5
- DuckDB /tmp file caching during request lifecycle
- Packages to add: ai, @ai-sdk/openai, @ai-sdk/anthropic, @supabase/supabase-js, @duckdb/duckdb-wasm, mysql2, shiki
- Packages to remove: @neondatabase/serverless, @aws-sdk/client-s3, @aws-sdk/s3-presigned-post, @aws-sdk/s3-request-presigner, openai

**From UX Design:**
- Purple accent #8B5CF6, dual dark/light theme
- Split-panel layout via react-resizable-panels (chat left, viz right)
- 10 composite components: chat-panel, message-bubble, code-block, chart-renderer, data-source-connector, schema-preview, workspace-card, kpi-cards, template-picker, report-viewer
- Desktop-first, mobile deferred to v1.5
- Skeleton loading states (never spinners)
- Keyboard shortcuts for panel presets (Cmd+1/2/3)
- Manrope (headings), Inter (body), JetBrains Mono (code)
- Tool call indicator with purple pulse animation
- Follow-up suggestion chips below AI responses

### FR Coverage Map

FR-1.1: Epic 1 - Google OAuth, Magic Link, email/password sign-up and login
FR-1.2: Epic 1 - Profile view and edit (name, email, avatar)
FR-1.3: Epic 1 - View current plan, quotas, credit balances
FR-1.4: Epic 1 - Upgrade, downgrade, cancel subscription
FR-1.5: Epic 1 - Purchase additional credit packs
FR-1.6: Epic 1 - Session deactivation on password change

FR-2.1: Epic 1 - Create workspace with name and description
FR-2.2: Epic 1 - Rename or delete workspace
FR-2.3: Epic 1 - View workspace list with stats
FR-2.4: Epic 1 - Enforce maxWorkspaces quota
FR-2.5: Epic 1 - Workspace cascade delete
FR-2.6: Epic 1 - Auto-create default workspace on first upload

FR-3.1: Epic 2 - CSV file upload via drag-and-drop or file picker
FR-3.2: Epic 2 - Excel upload with multi-sheet detection
FR-3.3: Epic 2 - JSON file upload (array-of-objects)
FR-3.4: Epic 2 - Supabase Storage upload, parse, schema inference
FR-3.5: Epic 2 - Preview table (first 100 rows) within 5 seconds
FR-3.6: Epic 2 - Enforce maxDataSources quota
FR-3.7: Epic 2 - Enforce maxFileUploadSizeMb with clear error
FR-3.8: Epic 2 - Delete data source (remove file + metadata)

FR-4.1: Epic 2 - PostgreSQL connection form
FR-4.2: Epic 2 - MySQL connection form
FR-4.3: Epic 2 - Test connection before saving
FR-4.4: Epic 2 - Schema introspection (tables, columns, types, keys)
FR-4.5: Epic 2 - AES-256 credential encryption
FR-4.6: Epic 2 - TLS/SSL database connections
FR-4.7: Epic 2 - Enforce maxDataSources quota for connections
FR-4.8: Epic 2 - Refresh (re-introspect) database schema
FR-4.9: Epic 2 - Disconnect (delete) database data source

FR-5.1: Epic 3 - Create conversation in workspace with data source selection
FR-5.2: Epic 3 - Natural-language questions with streaming AI responses
FR-5.3: Epic 3 - Agentic tool chaining (4 tools: inspect_schema, profile_data, analyze_results, suggest_followups)
FR-5.4: Epic 3 - Select AI provider per workspace (OpenAI/Anthropic)
FR-5.5: Epic 3 - AI context building (schema, history, tool results)
FR-5.6: Epic 3 - Deduct 1 ai_query credit per user message (bundled)
FR-5.7: Epic 3 - Credit indicator in chat, block when exhausted
FR-5.8: Epic 3 - View conversation history by title and date
FR-5.9: Epic 3 - Auto-generate conversation titles
FR-5.10: Epic 3 - Rename or delete conversations
FR-5.11: Epic 3 - Agent self-correction (2 retries on tool errors)
FR-5.12: Epic 3 - 3 follow-up question suggestions as clickable chips
FR-5.13: Epic 3 - Auto-profile data sources on first query

FR-5.14: Epic 5 - Proactive analysis on upload (distributions, outliers, insights)
FR-5.15: Epic 5 - Chart type suggestions based on data shape
FR-5.16: Epic 5 - 7 pre-built Analysis Templates
FR-5.17: Epic 5 - Template detection via column heuristics
FR-5.18: Epic 5 - Template multi-chart reports (KPIs, charts, anomalies, recommendations)
FR-5.19: Epic 5 - Report save and view in dedicated report view

FR-6.1: Epic 4 - AI generates SQL queries for data retrieval
FR-6.2: Epic 4 - AI generates Python code (pandas, numpy, sklearn, scipy)
FR-6.3: Epic 4 - AI autonomously selects SQL, Python, or both
FR-6.4: Epic 4 - SQL read-only validation before execution
FR-6.5: Epic 4 - Syntax-highlighted code block with copy button
FR-6.6: Epic 4 - Edit code in-place and Re-run
FR-6.7: Epic 4 - DuckDB in-memory SQL for file-based data
FR-6.8: Epic 4 - Live DB execution with READ ONLY, 30s timeout, 10K row limit
FR-6.9: Epic 4 - Pyodide sandbox (no filesystem, no network, whitelisted packages)
FR-6.10: Epic 4 - Bundled code_execution credit per user message
FR-6.11: Epic 4 - Results as data tables, scalar values, or error messages

FR-7.1: Epic 4 - Auto-select optimal chart type based on data shape
FR-7.2: Epic 4 - Interactive Recharts with tooltips, labels, legend
FR-7.3: Epic 4 - Chart types: bar, line, area, scatter, pie, donut, table
FR-7.4: Epic 4 - Save chart to workspace gallery with custom title
FR-7.5: Epic 4 - View saved charts in gallery grid
FR-7.6: Epic 4 - Delete saved charts
FR-7.7: Epic 4 - Charts render within 1 second for up to 10K rows

FR-8.1: Epic 1 - 4 subscription plans with defined quotas
FR-8.2: Epic 1 - Credit allocation on subscription start/renewal
FR-8.3: Epic 1 - Purchase additional credit packs
FR-8.4: Epic 1 - Block operations exceeding quotas with clear errors
FR-8.5: Epic 1 - Pricing page with plan comparison and annual toggle

FR-9.1: Epic 6 - Landing page (hero, features, stats, pricing, FAQ, CTA)
FR-9.2: Epic 6 - FAQ section
FR-9.3: Epic 6 - SEO-optimized metadata

FR-10.1: Epic 7 - Admin user list with plan, stats, credits
FR-10.2: Epic 7 - Admin plan management (create, edit, set default)
FR-10.3: Epic 7 - Admin user impersonation
FR-10.4: Epic 7 - Admin dashboard (users, workspaces, queries, MRR)

## Epic List

### Epic 1: Project Foundation & User Management
Users can sign up, create and manage workspaces, subscribe to plans, and manage their credits. Includes infrastructure migration to Supabase.
**FRs covered:** FR-1.1–1.6, FR-2.1–2.6, FR-8.1–8.5 (17 FRs)
**Tool distribution:** None (infrastructure + CRUD)
**Deployable checkpoint:** Users can register, create workspaces, subscribe to plans

### Epic 2: Data Source Integration
Users can upload files (CSV/Excel/JSON) and connect external databases (PostgreSQL/MySQL) with encrypted credentials, schema introspection, and data previews.
**FRs covered:** FR-3.1–3.8, FR-4.1–4.9 (17 FRs)
**Tool distribution:** None (data pipeline)
**Deployable checkpoint:** Users can bring data into the platform and preview it

### Epic 3: AI Chat & Conversations
Users can ask natural-language questions and receive AI-powered text answers with schema awareness, conversation history, follow-up suggestions, and credit tracking. Agent uses 4 tools: inspect_schema, profile_data, analyze_results, suggest_followups.
**FRs covered:** FR-5.1–5.13 (13 FRs)
**Tool distribution:** 4 tools (inspect_schema, profile_data, analyze_results, suggest_followups)
**Deployable checkpoint:** Working AI chat with schema-aware text answers and conversation management

### Epic 4: Code Execution & Visualization
AI generates and executes SQL (DuckDB) and Python (Pyodide) code, renders interactive charts, and manages a chart gallery. Adds 3 execution tools to the agent: execute_sql, execute_python, render_chart.
**FRs covered:** FR-6.1–6.11, FR-7.1–7.7 (18 FRs)
**Tool distribution:** 3 tools (execute_sql, execute_python, render_chart)
**Deployable checkpoint:** Full talk-to-your-data experience with code and charts

### Epic 5: Proactive Intelligence & Reports
AI automatically analyzes data on upload, detects business domains, suggests and executes analysis templates, and generates multi-chart business reports. Adds 3 intelligence tools: proactive_analysis, apply_template, generate_report.
**FRs covered:** FR-5.14–5.19 (6 FRs)
**Tool distribution:** 3 tools (proactive_analysis, apply_template, generate_report)
**Deployable checkpoint:** Julius.ai-level proactive intelligence with templates and reports

### Epic 6: Landing Page & Marketing
Visitors can discover Vizo, understand pricing, and convert to sign-up through a polished landing page with SEO optimization.
**FRs covered:** FR-9.1–9.3 (3 FRs)
**Tool distribution:** None (content + styling)
**Deployable checkpoint:** Public-facing marketing site ready for launch

### Epic 7: Admin Dashboard & Operations
Platform admin can manage users, subscription plans, and monitor platform health through the super admin panel.
**FRs covered:** FR-10.1–10.4 (4 FRs)
**Tool distribution:** None (admin UI)
**Deployable checkpoint:** Admin can operate and monitor the platform

## Epic 1: Project Foundation & User Management

Users can sign up, create and manage workspaces, subscribe to plans, and manage their credits. Includes infrastructure migration to Supabase.

### Story 1.1: Supabase Migration & Package Setup

As a **developer**,
I want the project migrated from Neon/S3 to Supabase PostgreSQL and Storage with correct packages installed,
So that all subsequent features build on the correct infrastructure.

**Acceptance Criteria:**

**Given** the existing Indie Kit codebase
**When** the migration is complete
**Then** Drizzle ORM connects to Supabase PostgreSQL via updated connection string
**And** Supabase Storage is configured for file uploads (S3-compatible)
**And** packages added: `ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@supabase/supabase-js`, `@duckdb/duckdb-wasm`, `mysql2`, `shiki`
**And** packages removed: `@neondatabase/serverless`, `@aws-sdk/client-s3`, `@aws-sdk/s3-presigned-post`, `@aws-sdk/s3-request-presigner`, `openai`
**And** existing auth (NextAuth v5) works with the new database
**And** `reports` DB schema is created (`src/db/schema/reports.ts`)
**And** database migrations run successfully
**And** the build passes with zero errors

### Story 1.2: Workspace CRUD API & Dashboard

As a **user**,
I want to create, view, rename, and delete workspaces from my dashboard,
So that I can organize my data analysis projects.

**Acceptance Criteria:**

**Given** an authenticated user
**When** they visit the dashboard
**Then** they see a list of all their workspaces with data source count, conversation count, and last activity timestamp (FR-2.3)

**Given** an authenticated user
**When** they create a workspace with a name and optional description
**Then** a new workspace is created and appears in the dashboard (FR-2.1)

**Given** an authenticated user
**When** they rename a workspace
**Then** the new name is persisted and displayed (FR-2.2)

**Given** an authenticated user
**When** they delete a workspace
**Then** the workspace and all its data sources, conversations, messages, and charts are permanently removed (FR-2.5)

### Story 1.3: Workspace Quotas & Auto-Creation

As a **user**,
I want workspace creation to respect my plan limits and a default workspace to appear when I first upload data,
So that I'm guided smoothly and protected from exceeding my plan.

**Acceptance Criteria:**

**Given** a user at their plan's `maxWorkspaces` limit
**When** they attempt to create another workspace
**Then** the system blocks creation with an error stating the limit and linking to the upgrade page (FR-2.4)

**Given** a user with no workspaces who uploads their first data source
**When** the upload completes
**Then** a workspace named "My First Workspace" is auto-created with the data source attached (FR-2.6)

### Story 1.4: Vizo Plan Configuration & Pricing Page

As a **visitor or user**,
I want to see Vizo's subscription plans with features and pricing,
So that I can choose the right plan for my needs.

**Acceptance Criteria:**

**Given** the Vizo platform
**When** plans are configured
**Then** 4 plans exist: Free (20 queries, 2 sources, 1 workspace, 5MB), Starter $19 (200/10/5/25MB), Pro $49 (1000/50/20/100MB), Team $99 (5000/unlimited/unlimited/500MB) (FR-8.1)

**Given** a subscription start or renewal
**When** credits are allocated
**Then** plan credits are assigned: Starter (100 ai_query + 50 code_execution), Pro (500+300), Team (2000+1000) (FR-8.2)

**Given** a visitor on the pricing page
**When** they view the page
**Then** all 4 plans display with feature comparison and monthly/annual toggle (annual = 2 months free) (FR-8.5)

### Story 1.5: User Profile & Credit Management

As a **user**,
I want to view my profile, see my credit balance, and purchase additional credits,
So that I can manage my account and resource consumption.

**Acceptance Criteria:**

**Given** an authenticated user
**When** they visit profile settings
**Then** they can view and edit their name, email, and avatar (FR-1.2)
**And** they see their current plan, quotas, and credit balances (FR-1.3)

**Given** a user who wants more credits
**When** they purchase a credit pack
**Then** ai_query credits added at $0.02/credit (<500) or $0.015/credit (500+), code_execution at $0.01/credit (FR-8.3, FR-1.5)

**Given** a user changing plans
**When** they upgrade, downgrade, or cancel
**Then** the subscription change is processed via the payment provider (FR-1.4)

**Given** an operation exceeding plan quotas
**When** the user attempts it
**Then** the system blocks with a clear error stating the limit and linking to the upgrade page (FR-8.4)

**Given** a user who changes their password
**When** the change is saved
**Then** all other active sessions are deactivated (FR-1.6)

---

## Epic 2: Data Source Integration

Users can upload files (CSV/Excel/JSON) and connect external databases (PostgreSQL/MySQL) with encrypted credentials, schema introspection, and data previews.

### Story 2.1: CSV File Upload & Schema Inference

As a **user**,
I want to upload a CSV file and have the system automatically detect its schema,
So that I can start analyzing my data immediately.

**Acceptance Criteria:**

**Given** an authenticated user in a workspace
**When** they upload a CSV file via drag-and-drop or file picker
**Then** the file is uploaded to Supabase Storage via presigned URL (FR-3.1)
**And** the system parses the CSV and infers schema: column names, data types (string, number, date, boolean), null percentage, row count, and sample values (FR-3.4)
**And** a data source record is created in the database with schema metadata
**And** the upload completes within 5 seconds for files up to 50MB (FR-3.5)

**Given** a file exceeding the user's plan `maxFileUploadSizeMb`
**When** they attempt to upload
**Then** the system rejects the file with a clear error stating the size limit (FR-3.7)

### Story 2.2: Excel & JSON File Upload

As a **user**,
I want to upload Excel and JSON files with automatic format detection,
So that I can use my existing data regardless of format.

**Acceptance Criteria:**

**Given** an authenticated user
**When** they upload an Excel file (.xlsx)
**Then** the system detects all sheets and lets the user select which sheet(s) to import (FR-3.2)
**And** each selected sheet is parsed with schema inference

**Given** an authenticated user
**When** they upload a JSON file (array-of-objects format)
**Then** the system parses the JSON and infers schema from object keys (FR-3.3)

### Story 2.3: Data Preview Table

As a **user**,
I want to see a preview of my uploaded data after import,
So that I can verify the data was loaded correctly.

**Acceptance Criteria:**

**Given** a successfully uploaded and parsed data source
**When** the user views the data source
**Then** a preview table displays the first 100 rows with column headers and types (FR-3.5)
**And** the preview loads within 5 seconds for files up to 50MB

### Story 2.4: PostgreSQL Database Connector

As a **user**,
I want to connect my PostgreSQL database and browse its schema,
So that I can analyze my production data through Vizo.

**Acceptance Criteria:**

**Given** an authenticated user on Starter plan or above
**When** they provide PostgreSQL connection details (host, port, database, username, password, SSL toggle)
**Then** the system tests the connection and displays success or failure with error details (FR-4.1, FR-4.3)

**Given** a successful connection test
**When** the connection is saved
**Then** credentials are encrypted using AES-256 before storage (FR-4.5)
**And** TLS/SSL is used when available (FR-4.6)
**And** the system introspects the schema: table names, column names/types, primary/foreign keys, row count estimates (FR-4.4)

### Story 2.5: MySQL Database Connector

As a **user**,
I want to connect my MySQL database and browse its schema,
So that I can analyze MySQL-based data through Vizo.

**Acceptance Criteria:**

**Given** an authenticated user on Starter plan or above
**When** they provide MySQL connection details (host, port, database, username, password)
**Then** the system tests the connection and displays success or failure with error details (FR-4.2, FR-4.3)

**Given** a successful connection test
**When** the connection is saved
**Then** credentials are encrypted using AES-256 before storage (FR-4.5)
**And** schema introspection runs and discovers tables, columns, types, keys (FR-4.4)

### Story 2.6: Data Source Management & Quotas

As a **user**,
I want to manage my data sources (refresh schema, delete) and have the system enforce my plan limits,
So that I can maintain and control my connected data.

**Acceptance Criteria:**

**Given** a user at their plan's `maxDataSources` limit
**When** they attempt to add another data source (upload or connect)
**Then** the system blocks with an error stating the limit and linking to upgrade (FR-3.6, FR-4.7)

**Given** a user with a connected database
**When** they click "Refresh Schema"
**Then** the system re-introspects the database and updates stored schema metadata (FR-4.8)

**Given** a user who deletes a file data source
**When** the deletion is confirmed
**Then** the Supabase Storage file and all associated metadata are removed within 24 hours via background job (FR-3.8)

**Given** a user who disconnects a database data source
**When** the disconnection is confirmed
**Then** encrypted credentials and all associated metadata are permanently removed (FR-4.9)

---

## Epic 3: AI Chat & Conversations

Users can ask natural-language questions and receive AI-powered text answers with schema awareness, conversation management, follow-up suggestions, and credit tracking. Agent uses 4 tools: inspect_schema, profile_data, analyze_results, suggest_followups.

### Story 3.1: AI Provider Configuration & Agent Core

As a **user**,
I want to select my preferred AI provider and have the system process my questions through an intelligent agent,
So that I get high-quality answers powered by the model I trust.

**Acceptance Criteria:**

**Given** the Vercel AI SDK is installed
**When** the `/api/app/chat` route receives a user message
**Then** it processes through `streamText()` with the configured model, system prompt, and agent tools
**And** the system prompt includes schema context, tool guidelines, and safety rules (split prompts architecture)

**Given** a workspace
**When** the user visits workspace settings
**Then** they can select their AI provider: OpenAI GPT-4o or Anthropic Claude (FR-5.4)
**And** the selection is persisted and used for all conversations in that workspace

**Given** any AI request
**When** it is processed
**Then** `maxSteps: 8` is enforced as the hard limit on agent tool calls per message

### Story 3.2: Conversation Management

As a **user**,
I want to create, browse, rename, and delete conversations within my workspace,
So that I can organize my analysis sessions.

**Acceptance Criteria:**

**Given** an authenticated user in a workspace
**When** they start a new conversation
**Then** they can optionally select specific data source(s) to focus the analysis (FR-5.1)

**Given** a user's first message in a conversation
**When** the AI responds
**Then** the conversation title is auto-generated from the first message (AI-summarized to <50 characters) (FR-5.9)

**Given** a workspace with conversations
**When** the user views the conversation list
**Then** conversations are listed by title and last activity date (FR-5.8)

**Given** a conversation
**When** the user renames or deletes it
**Then** the change is persisted (FR-5.10)
**And** all messages and associated data are removed on delete

### Story 3.3: Chat UI with Streaming

As a **user**,
I want to type questions and see AI responses stream in real-time in a split-panel layout,
So that I get a responsive, professional chat experience.

**Acceptance Criteria:**

**Given** a user in a workspace conversation
**When** they type a question and send it
**Then** the AI response streams token-by-token using `useChat` hook with first token in <2 seconds (FR-5.2)

**Given** the chat interface
**When** it renders
**Then** it uses a split-panel layout (chat left, visualization right) via `react-resizable-panels`
**And** message bubbles distinguish user vs AI messages
**And** a credit indicator shows "X of Y credits used" (FR-5.7)

**Given** a user with zero remaining credits
**When** they attempt to send a message
**Then** the system blocks the query with a message and link to purchase more credits (FR-5.7)

**Given** each AI response
**When** 1 ai_query credit is deducted per user message (FR-5.6)
**Then** all tool calls within the agent loop for that message are included in the single credit

### Story 3.4: Agent Tools — Schema Inspection & Data Profiling

As a **user**,
I want the AI to automatically understand my data structure and provide profiling insights,
So that it can answer my questions accurately.

**Acceptance Criteria:**

**Given** a user's first query in a conversation
**When** the agent hasn't inspected the data source schema yet
**Then** the agent auto-calls `inspect_schema` to discover tables, columns, types, row counts, and sample values before answering (FR-5.13)

**Given** the `inspect_schema` tool
**When** called by the agent
**Then** it returns the data source schema from cache or introspects if not cached
**And** the result is included in the agent's context for subsequent tool calls (FR-5.5)

**Given** the `profile_data` tool
**When** called by the agent
**Then** it returns statistical profiling: distributions, null rates, outlier counts, unique value counts per column

### Story 3.5: Agent Self-Correction & Follow-up Suggestions

As a **user**,
I want the AI to recover from errors and suggest follow-up questions,
So that I have a smooth, guided analysis experience.

**Acceptance Criteria:**

**Given** a tool call that returns an error
**When** the agent processes the error
**Then** it calls `analyze_results` to understand the failure and retries with a modified approach, up to 2 times (FR-5.11)
**And** if all retries fail, it surfaces a user-friendly explanation of what was attempted

**Given** the `suggest_followups` tool
**When** called after an AI response
**Then** it generates 3 contextual follow-up questions displayed as clickable chips below the message (FR-5.12)
**And** clicking a chip sends that question as the user's next message

**Given** the agent context
**When** building for each turn
**Then** it includes: full data source schema(s), last 20 messages, tool call history within current turn, previous tool results, and workspace metadata (FR-5.5)

---

## Epic 4: Code Execution & Visualization

AI generates and executes SQL (DuckDB) and Python (Pyodide), renders interactive charts, and manages a chart gallery. Adds 3 tools to the agent: execute_sql, execute_python, render_chart.

### Story 4.1: DuckDB SQL Execution Engine

As a **user**,
I want the AI to generate and execute SQL queries against my uploaded files and connected databases,
So that I can get precise data answers.

**Acceptance Criteria:**

**Given** a user question that requires data retrieval
**When** the agent calls `execute_sql`
**Then** for file-based data: the file is downloaded from Supabase Storage to `/tmp` cache, loaded into DuckDB, query executed, and DuckDB instance destroyed (FR-6.7)
**And** for database sources: the query runs against the live connection with READ ONLY transaction mode, 30-second timeout, and 10,000 row limit (FR-6.8)

**Given** AI-generated SQL
**When** it is submitted for execution
**Then** it is validated as read-only: no INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, or GRANT allowed (FR-6.4)
**And** invalid SQL is rejected with a clear error returned to the agent

**Given** the agent deciding on tool usage
**When** a question needs data
**Then** the agent autonomously selects SQL, Python, or both in sequence based on complexity (FR-6.3)

### Story 4.2: Pyodide Python Execution Engine

As a **user**,
I want the AI to generate and execute Python code for statistical analysis and ML tasks,
So that I can get advanced analytical insights.

**Acceptance Criteria:**

**Given** a user question requiring statistical analysis, ML, or complex data transformation
**When** the agent calls `execute_python`
**Then** Python code runs in Pyodide sandbox with: no filesystem access, no network access, whitelisted packages only (pandas, numpy, sklearn, scipy, matplotlib) (FR-6.9)
**And** execution has a 30-second timeout and 256MB memory limit (FR-6.9)

**Given** the AI generating Python code
**When** it generates imports
**Then** only whitelisted packages are allowed (FR-6.2)

**Given** execution results
**When** they are returned
**Then** they display as data tables (up to 10,000 rows with pagination), scalar values, or error messages (FR-6.11)

### Story 4.3: Code Display & Re-Run

As a **user**,
I want to see the generated code, edit it, and re-run my modifications,
So that I can verify and customize the AI's work.

**Acceptance Criteria:**

**Given** an AI response that includes generated code
**When** it renders in the chat
**Then** the code appears in a syntax-highlighted (shiki), collapsible code block with a copy-to-clipboard button (FR-6.5)

**Given** a code block
**When** the user clicks "Edit"
**Then** they can modify the code in-place and click "Re-run" to execute the modified version (FR-6.6)

**Given** a re-run execution
**When** code is modified and re-run
**Then** the new results replace the previous results in the visualization panel

### Story 4.4: Chart Rendering & Auto-Selection

As a **user**,
I want the AI to automatically create the best chart for my data,
So that I can see visual insights instantly.

**Acceptance Criteria:**

**Given** the `render_chart` agent tool
**When** the agent calls it with query results
**Then** it generates a Recharts configuration based on the data shape (FR-7.1):
  - Single metric → stat card
  - Category + value → bar chart
  - Time series → line chart
  - Two numeric columns → scatter plot
  - Proportions → pie chart

**Given** a chart configuration
**When** rendered on the client via `onToolCall` callback
**Then** it displays as an interactive Recharts chart with hover tooltips, axis labels, legend, and responsive sizing (FR-7.2)
**And** supports chart types: bar (vertical/horizontal), line, area, scatter, pie, donut, and data table (FR-7.3)
**And** renders within 1 second for datasets up to 10,000 rows (FR-7.7)

### Story 4.5: Chart Gallery & Credit Deduction

As a **user**,
I want to save charts to a gallery and have code execution credits tracked fairly,
So that I can revisit visualizations and manage my usage.

**Acceptance Criteria:**

**Given** a rendered chart
**When** the user clicks "Save Chart"
**Then** the chart is saved to the workspace gallery with a custom title (FR-7.4)

**Given** a workspace
**When** the user visits the chart gallery
**Then** all saved charts display in a grid layout (FR-7.5)

**Given** a saved chart
**When** the user clicks delete
**Then** the chart is permanently removed from the gallery (FR-7.6)

**Given** a user message that triggers any code execution (SQL or Python)
**When** the agent loop completes
**Then** 1 `code_execution` credit is deducted regardless of how many execution tool calls were made (FR-6.10)

---

## Epic 5: Proactive Intelligence & Reports

AI automatically analyzes data on upload, detects business domains, suggests and executes analysis templates, and generates multi-chart business reports. Adds 3 tools: proactive_analysis, apply_template, generate_report.

### Story 5.1: Proactive Data Analysis on Upload

As a **user**,
I want the AI to automatically analyze my data when I upload it and surface key insights,
So that I get immediate value before asking any questions.

**Acceptance Criteria:**

**Given** a user who uploads a new data source
**When** schema inference completes
**Then** the agent's `proactive_analysis` tool runs automatically: identifies distributions, outliers, correlations, and data quality issues (FR-5.14)
**And** suggests 3-5 key insights displayed in the chat

**Given** query results from any analysis
**When** the agent evaluates the data
**Then** it suggests chart types based on data shape as clickable options (e.g., "📊 Bar chart", "📈 Line trend", "🔵 Scatter plot") (FR-5.15)

### Story 5.2: Analysis Templates & Detection

As a **user**,
I want the system to recognize my data domain and suggest pre-built analysis templates,
So that I can run professional analyses without knowing what to ask.

**Acceptance Criteria:**

**Given** the template system
**When** configured
**Then** 7 pre-built Analysis Templates exist as JSON configs: Ad Campaign Performance, Sales KPI, Financial Overview, E-commerce Analytics, User Analytics, Churn & Retention, Operations Metrics (FR-5.16)

**Given** a user who uploads data
**When** the agent inspects the schema
**Then** it detects which template matches via column name heuristics and suggests running it (e.g., "This looks like ad campaign data — want me to run the Ad Performance analysis?") (FR-5.17)

**Given** the `apply_template` tool
**When** the user accepts a template suggestion
**Then** the agent executes the template's ordered steps (inspect → SQL queries → charts → insights)

**Given** the templates browse page
**When** a user visits `/app/templates`
**Then** all 7 templates display with descriptions, required data shape, and a "Run" button

### Story 5.3: Report Generation & Management

As a **user**,
I want templates to produce comprehensive multi-chart reports that I can save and revisit,
So that I get professional business intelligence output.

**Acceptance Criteria:**

**Given** the `generate_report` tool
**When** called after a template execution or explicit user request
**Then** it assembles a multi-chart report with: KPI cards, trend charts, rankings, anomaly detection, and actionable business recommendations (FR-5.18)

**Given** a generated report
**When** the user clicks "Save Report"
**Then** the report is saved to the workspace and viewable in a dedicated report view (FR-5.19)

**Given** a workspace
**When** the user visits the reports page
**Then** all saved reports are listed with title, template used, date created, and a preview

**Given** the reports DB schema
**When** reports are saved
**Then** report data is stored in the `reports` table with reference to workspace, template, and chart configurations

---

## Epic 6: Landing Page & Marketing

Visitors can discover Vizo, understand pricing, and convert to sign-up through a polished landing page with SEO optimization.

### Story 6.1: Vizo Landing Page & SEO

As a **visitor**,
I want to discover what Vizo offers through a compelling landing page,
So that I can decide to sign up.

**Acceptance Criteria:**

**Given** a visitor arriving at the Vizo homepage
**When** the landing page loads
**Then** it includes: hero section ("Your Data Analyst, Powered by AI"), features grid (6 features), stats section, pricing comparison, testimonials, FAQ, and CTA (FR-9.1)
**And** the page uses the purple accent theme (#8B5CF6) with Vizo branding

**Given** the FAQ section
**When** a visitor reads it
**Then** it answers: supported data sources, SQL/Python requirement, data security, credit system, sharing capabilities (FR-9.2)

**Given** the page metadata
**When** search engines crawl the page
**Then** SEO-optimized metadata is present: title, description, Open Graph tags, and sitemap (FR-9.3)
**And** Lighthouse Performance score > 85

---

## Epic 7: Admin Dashboard & Operations

Platform admin can manage users, subscription plans, and monitor platform health through the super admin panel.

### Story 7.1: Vizo Admin Dashboard & User Management

As a **platform admin**,
I want to manage users, plans, and monitor platform metrics,
So that I can operate Vizo effectively.

**Acceptance Criteria:**

**Given** a super admin (SUPER_ADMIN_EMAILS)
**When** they access `/super-admin`
**Then** the dashboard shows: total users, active users (7d), total workspaces, queries today, MRR (FR-10.4)

**Given** the admin user list
**When** the admin views users
**Then** each user shows: email, plan, signup date, workspace count, query count, credit balance (FR-10.1)

**Given** admin plan management
**When** the admin creates or edits a plan
**Then** they can set: name, quotas, pricing, and default plan status (FR-10.2)

**Given** admin debugging needs
**When** the admin impersonates a user
**Then** the existing Indie Kit impersonation feature works with Vizo workspaces and data (FR-10.3)
