# 🕊️ Comeback Kabootar

> **The bird that follows up so you don't have to.**

Send it. Track it. Forget it. Comeback Kabootar is a career follow-up automation tool with personality. We do the boring work; you get the replies.

---

## 🛑 The Problem

Job hunting and networking are exhausting. You spend hours finding the right HR contact, crafting the perfect cold email, and hitting send. But the real anxiety starts after. Tracking who to follow up with, when to do it, and forcing yourself to send that awkward "just bubbling this up" email is soul-crushing.

Most people give up after one email. The people who get hired follow up relentlessly.

## 💡 The Solution

Comeback Kabootar acts as your slightly tired, highly competent internet bird. It automates the entire follow-up sequence. You connect your inbox, pick a template, select your contacts, and define a schedule (Weekly, Bi-Weekly, Monthly).

Kabootar sends automated, batched emails directly from your account, ensuring high deliverability while strictly respecting anti-spam limits.

### Core Value

- **Effortless Persistence:** Systems beat willpower. Kabootar never forgets to follow up.
- **Community-Driven Intelligence:** A verified database of contacts and a marketplace of high-converting email templates.
- **Peace of Mind:** You focus on interview prep; Kabootar handles the hovering.

---

## ✨ Features

- **Smart Job Campaigns:** Schedule follow-up batches (up to 50 emails/batch) with customizable frequency.
- **Bring Your Own Inbox:** Native OAuth integration for Google and Microsoft. Emails are sent _from_ you, not a generic server.
- **Template Marketplace:** Write your own emails or "Fork" public templates that have high community star ratings. Supports up to 3 attachments.
- **Contact Verification Engine:** A crowdsourced database of professionals. Contribute 50 verified contacts, and the system automatically feeds the Kabootar (unlocking 1 month of Premium).
- **Safe & Compliant:** Hard limits on follow-up caps and batch sizes to protect your domain reputation.

---

## 🏗️ Architecture

This backend is a **Modular Monolith** using a **Feature-Sliced, feature-first** layout. It is optimized for high cohesion, low coupling, testability, and long-term scalability (including eventual extraction into microservices).

### Core Philosophy

Four invariants hold across the codebase:

1. **Features own behavior** — User-visible capabilities live in feature modules.
2. **Entities own rules** — Shared business models and invariants live in the entities layer.
3. **Infrastructure owns side-effects** — Database, OAuth, mail, queues, and other I/O are isolated.
4. **Nothing bypasses layers** — Dependencies flow in one direction; no folder is “misc,” and every file has a clear architectural role.

### Dependency Rule

```
app → processes → features → entities → shared
                 ↓
           infrastructure
```

**Forbidden:**

- Entities importing infrastructure
- Features importing Express
- Domain/entities importing Redis or DB clients
- Controllers (or API handlers) calling the database directly

This can be enforced via ESLint layer boundaries.

### API response contract

All endpoints use the same JSON shapes so clients and the error handler behave consistently. Types are defined in `shared/api/response.ts` (`SuccessResponse<T>`, `FailureResponse`, `ErrorPayload`).

- **Success:** `{ success: true, data: T }` — use `ok(res, data)` (200), `created(res, data)` (201), or `noContent(res)` (204).
- **Failure:** `{ success: false, error: { message: string, code?: string } }` — use `unauthorized`, `validationError`, `notFound`, `internalError`, or `errorWithStatus(res, status, message, code)`. The global error middleware maps `AppError` to status and uses the same failure shape.

---

## 📂 Layer-by-Layer Breakdown

### 1. `app/` — Application Shell

**Purpose:** Glue everything together. No business logic.

**Responsibilities:**

- Express setup and server bootstrap
- Dependency injection (container and bindings)
- Global middleware (auth, error handling, rate limiting)
- Route mounting

**What goes here:** `server.ts`, `express.ts`, `router.ts`, `di/` (container, bindings), `middlewares/` (auth, error, rate-limit). Entry point wires the app and calls `listen`. Controllers and use cases are never implemented here.

---

### 2. `processes/` — Cross-Feature Workflows

**Purpose:** Multi-step flows that span more than one feature.

**Examples:** “Run Job → Dispatch emails → Track delivery → Bill / deduct credits → Notify user.”

**What goes here:**

- Orchestration logic
- Long-running or saga-style flows
- Coordination between features (e.g. job repo, quota, ledger, notifier)
- One folder per process (e.g. `job-dispatch/`, `contact-verification/`, `billing-cycle/`)

**Rule:** No inline DB queries. All data access goes through repositories (concrete implementations in infrastructure, injected via DI). Processes call use cases and repositories, not raw Knex or Redis.

---

### 3. `features/` — Business Capabilities

**Purpose:** The heart of the system. Each feature is a bounded unit of user-visible behavior.

**Per-feature layout (template):**

```text
features/<feature-name>/
├── api/           # HTTP interface (controllers, routes)
├── model/         # (Optional) Feature-specific state and domain models
├── service/       # Injectable service classes (one per route capability); use DI
├── validators/    # Request/command schemas (e.g. Zod)
├── tests/
└── index.ts
```

**Folder roles:**

| Folder          | Role                                                                   | Example                                         |
| --------------- | ---------------------------------------------------------------------- | ----------------------------------------------- |
| **api/**        | Controllers only. Parse request, call one service, return response.    | `auth.controller.ts`, `routes.ts`                          |
| **service/**    | Injectable service classes (one per route capability) with `execute()`. | `initiate-google-auth.service.ts`, `get-current-user.service.ts` |
| **model/**      | (Optional) Feature-level entities, value objects, and domain logic.     | `job.entity.ts`, `job.types.ts`                            |
| **validators/** | Input validation (Zod/Joi).                                            | `callback.schema.ts`                                       |

**Rules:** No Express/DB/OAuth in model or service beyond what’s abstracted behind contracts. Repositories and OAuth are concrete in infrastructure and injected via DI. Controllers let service errors propagate to the global error middleware.

---

### 4. `entities/` — Core Domain

**Purpose:** Shared business objects and rules used across multiple features.

**What goes here:**

- Business invariants and value objects
- Shared entity definitions (User, Contact, Company, Template, Job, etc.)
- Policies and small rule functions that belong to the entity (e.g. verification rules, status transitions)

**Layout idea:** One folder per entity (e.g. `user/`, `contact/`, `company/`, `template/`, `billing/`) with files like `*.entity.ts`, `*.types.ts`, `*.policy.ts` or `*.rules.ts`.

**Rule:** No Express, Redis, OAuth clients, or any infrastructure. Only types, pure functions, and rich domain methods that enforce invariants.

---

### 5. `shared/` — Reusable Primitives

**Purpose:** Code used by many layers without belonging to a single feature or entity.

**What goes here:**

- **types/** — Shared TypeScript types, branded types, enums
- **errors/** — Custom error classes (AppError and subclasses: NotFoundError, UnauthorizedError, etc.). Features should throw these for business/validation failures so the error middleware returns consistent responses; features may extend with their own (e.g. AuthError extends UnauthorizedError).
- **utils/** — Pure helpers (formatting, parsing, etc.)
- **logger/** — Logging interface or wrapper
- **crypto/** — Hashing, signing (used by auth/infra)
- **result/** — Result type and helpers (e.g. `Result<T, E>`)
- **testing/** — Test utilities, fakes, factories

**Rule:** No business logic that belongs to a feature or entity. No direct dependency on infrastructure; infra may depend on shared.

---

### 6. `infrastructure/` — External Systems

**Purpose:** All side-effects and integrations with the outside world.

**What goes here:**

- **db/** — Knex instance, connection config, **TransactionRunner** (wraps `knex.transaction`), and **repositories** (e.g. `job.repo.pg.ts`, `user.repo.pg.ts`) that depend only on `RepositoryContext`. Repositories that support transactions accept an optional transaction context on each method; services that need atomicity use `TransactionRunner.run(tx => { ... })` and pass `tx` into every repo call inside the callback.
- **oauth/** — Google and Microsoft OAuth clients
- **mail/** — Email provider (e.g. Gmail API wrapper)
- **queue/** — BullMQ (or other queue) client
- **cache/** — Redis or other cache client (optional)
- **billing/** — Payment provider client (if any)

**Rule:** Repositories and OAuth clients are concrete classes registered in DI; features and processes depend on them via tokens. No business rules; only I/O and mapping to/from domain shapes.

---

### 7. `config/` — Environment & Configuration

**Purpose:** Typed, centralized configuration only.

**What goes here:** `app.ts` — validated environment variables and app-shaped config (database, cluster, log, etc.). No business logic; add further config files here only when needed (e.g. oauth, redis).

---

### 8. `migrations/` — Database Migrations

**Purpose:** Versioned schema changes (e.g. Knex migrations). No application logic; only DDL and seed data as needed.

---

## 🔄 Programming Style

A hybrid of OO and functional is recommended:

| Layer          | Style                         |
| -------------- | ----------------------------- |
| Entities       | Rich domain objects           |
| Use cases / services | Classes (inject repos, infra via DI) |
| Controllers    | Functions                     |
| Shared utils   | Pure functions                |
| Infrastructure | Concrete classes (repos, OAuth, etc.) |

This keeps domain logic explicit and testable without forcing heavy OOP or pure FP across the whole stack.

### Type and naming convention

Use **explicit named types and interfaces** (avoid inline object types in public APIs). Prefer a **one-line comment** above each type describing its role. Do **not** use `I` or `T` prefixes.

| Suffix / role | Use | Examples |
| -------------- | --- | -------- |
| (none) | Domain entity | `User`, `OAuthCredential` |
| `Row` | DB row (snake_case) | `UserRow`, `OAuthCredentialRow` |
| `Dto` | Data transferred to client | `UserDto` |
| `Input` | Service/use-case input | `HandleGoogleCallbackInput` |
| `Result` | Service/use-case output | `HandleGoogleCallbackResult`, `InitiateGoogleAuthResult` |
| `Request*` | HTTP/Express context | `RequestUser` (user on `req`) |
| `*Payload` | JWT or external API payload | `UserJwtPayload`, `VerifiedJwtPayload` |
| `*Response` | External API response (raw) | `GoogleTokenApiResponse`, `GoogleUserInfoApiResponse` |

**Auth and identity** (login, callback, logout, `/me`) are implemented in `features/authentication` and are the reference for one service per route capability and cookie-based JWT.

---

## 🧪 Testing Strategy

- **Unit:** Focus on features (services) and entities. Mock repositories and infrastructure.
- **Integration:** Real DB and Redis where needed; test repositories and processes.
- **E2E:** HTTP requests through the app to verify responses and critical flows.

Tests can live under `features/<name>/tests/`, plus top-level `tests/unit/`, `tests/integration/`, and `tests/e2e/` if you prefer a single test tree.

---

## 📦 Dependency Injection

A central container (e.g. `app/di/container.ts`) registers controllers, services, repositories, and infrastructure (e.g. `UserRepositoryPostgres`, `GoogleOAuthClient`). Features depend on tokens; implementations live in infrastructure. This keeps features testable via mocks.

---

## 📈 Scaling and Extraction

When the monolith outgrows a single deployable unit, feature (or process) modules can be extracted into separate services. Because features depend on injected infrastructure and layers are isolated, the migration is mostly mechanical: move a feature folder, point its implementations to new runtimes, and expose or call APIs as needed.

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Query builder / migrations:** Knex.js
- **Background jobs:** BullMQ + Redis
- **Authentication:** JWT + Google/Microsoft OAuth 2.0

---

## 📁 Folder Structure Overview

```text
src/
│
├── app/                    # Application shell: server, Express, DI, global middleware
│   ├── server.ts
│   ├── express.ts
│   ├── router.ts
│   ├── di/
│   │   ├── container.ts
│   │   └── bindings.ts
│   └── middlewares/
│       ├── auth.middleware.ts
│       ├── error.middleware.ts
│       └── rate-limit.middleware.ts
│
├── processes/              # Cross-feature workflows (orchestration, sagas)
│   ├── job-dispatch/
│   ├── contact-verification/
│   └── billing-cycle/
│
├── features/               # User-visible capabilities (one folder per feature)
│   └── <feature-name>/
│       ├── api/            # Controllers, routes
│       ├── model/          # (Optional) Feature entities, types
│       ├── service/        # Service classes (one per route capability); use DI
│       ├── validators/
│       ├── tests/
│       └── index.ts
│
├── entities/               # Shared domain models and rules
│   ├── user/
│   ├── contact/
│   ├── company/
│   ├── template/
│   └── billing/
│
├── shared/                 # Reusable primitives
│   ├── api/                # Response contract (success, paginated, failure)
│   ├── db/                 # Transaction contract (TransactionRunner, TransactionContext)
│   ├── types/
│   ├── errors/
│   ├── utils/
│   ├── logger/
│   ├── crypto/
│   ├── result/
│   └── testing/
│
├── infrastructure/         # External systems and I/O
│   ├── db/
│   │   ├── knex.ts
│   │   ├── transaction-runner.ts
│   │   └── repositories/
│   ├── oauth/
│   ├── mail/
│   ├── queue/
│   ├── cache/
│   └── billing/
│
├── config/                 # Environment and typed config
│   └── app.ts
│
└── migrations/             # Knex (or other) migrations
```

**Entry point:** `src/app/server.ts` — wires the app and calls `listen`; shutdown helpers live in `app/shutdown.ts`.

---

## 🚀 Local Setup

### Prerequisites

- Node.js (v18+)
- pnpm
- PostgreSQL
- Redis (for background jobs)

### 1. Clone the repository

```bash
git clone https://github.com/devnadeemashraf/comeback-kabootar-backend.git
cd comeback-kabootar-backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment variables

Copy `.env.example` to `.env` and fill in your local values (Postgres, Redis, OAuth, etc.).

```bash
cp .env.example .env
```

### 4. Run migrations

```bash
pnpm migrate
```

### 5. Start the server

```bash
pnpm dev
```

The API runs at `http://localhost:3000` (or your configured `PORT`).

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please keep the code aligned with the **modular monolith and feature-first** structure: features own behavior, entities own rules, infrastructure owns side-effects, and layers are not bypassed. The folder structure in this README (“Folder Structure Overview” and “Layer-by-Layer Breakdown”) is the source of truth; new code should follow it so that docs and codebase stay in sync.

---

**Comeback Kabootar** • _Hovering so you don't have to._
