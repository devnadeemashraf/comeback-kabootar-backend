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

This project follows a **Lite Domain-Driven Design (DDD)** approach utilizing **Clean Architecture** principles.

Instead of heavy OOP (abstract classes and private constructors), this backend relies on a **functional approach** tailored for TypeScript and Express. We use pure functions, interfaces, and native TS utility types to enforce business rules while keeping the codebase fast and idiomatic.

### The Dependency Rule

Dependencies only point _inward_. The core domain knows nothing about the database, Express, or external APIs.

1. **Domain Layer:** Interfaces and pure functions. Dictates _what_ the system does.
2. **Application Layer:** Use cases. Dictates _how_ to coordinate the domain and infrastructure.
3. **Infrastructure Layer:** Databases, external APIs (Google/MS).
4. **Interfaces Layer:** Express routes, controllers, and background workers.

---

## 📂 Folder Structure

```text
src/
├── domain/                 # 🟢 CORE: Zero external dependencies. Pure TypeScript.
│   ├── types/              # String unions, branded types (ProviderType, EmailAddress)
│   ├── entities/           # Data structures representing database state (User, Contact)
│   └── services/           # Pure functions enforcing business rules (e.g., UserDomain.addCredits)
│
├── application/            # 🟡 USE CASES: Orchestrates the flow of data.
│   ├── use-cases/          # ScheduleJob.ts, ForkTemplate.ts, VerifyContact.ts
│   └── ports/              # Interfaces for external tools (IEmailService, IUserRepository)
│
├── infrastructure/         # 🔵 EXTERNAL: Implementations of the Application ports.
│   ├── database/           # Knex instance, configuration, and migrations
│   ├── repositories/       # Postgres implementation of IUserRepository
│   └── services/           # External API SDKs (GoogleOAuthService, MicrosoftGraphService)
│
├── interfaces/             # 🟣 DELIVERY: How the outside world talks to our app.
│   ├── http/               # Express specific code
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Parses requests, calls Use Cases, returns HTTP responses
│   │   └── middlewares/    # Auth verification, rate limiting, error handling
│   └── workers/            # BullMQ/Redis queue consumers (e.g., EmailDispatcherWorker)
│
├── core/                   # Code needed by the entire application
└── shared/                 # Code shared acorss different layers

```

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Query Builder / Migrations:** Knex.js
- **Background Jobs:** BullMQ + Redis
- **Authentication:** JWT + Google/Microsoft OAuth 2.0

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

### 3. Environment Variables

Copy the `.env.example` file and fill in your local details.

```bash
cp .env.example .env
```

_Ensure you have a valid Postgres connection string and Redis URL configured._

### 4. Run Migrations

Set up your database tables.

```bash
npm run migrate:up
```

### 5. Start the Server

Start the Express API in development mode.

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or your configured PORT).

---

## 🤝 Contributing

Found a bug or want to add a feature?

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Make sure your code adheres to the existing functional DDD patterns. Keep it simple. Keep it clean.

---

**Comeback Kabootar** • _Hovering so you don't have to._
