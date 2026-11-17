# Lesson Service

_A microservice for the 42 ft_transcendence "Surprise" curriculum that manages lesson metadata,
tags, file associations, and search across the platform._

The **Lesson Service** is an [AdonisJS 7](https://adonisjs.com/) microservice (Node 24,
TypeScript 6, ESM) that owns the lifecycle of a `lesson`: its header (title, description, privacy,
slug), its tags, and the list of external files attached to it. It does **not** store lesson content
itself; files live in the external **File Service**, while this service keeps the metadata and the
mapping between lessons and files.

Other services provide cross-cutting concerns:

- **Auth Service** validates bearer tokens.
- **User Service** supplies the username used to backfill a local `users` shadow table.
- **File Service** owns the actual objects and answers ownership queries.
- **Redis** carries the broker streams (`lesson.service` outbound, `auth.events` inbound).

## What this service does

- Creates, updates, and deletes lesson headers (`lesson_headers`).
- Manages many-to-many tags (`tags` ↔ `lesson_tags`).
- Attaches/detaches file references (`lesson_files`) after verifying ownership with the File Service.
- Enforces ownership-based access control on mutations.
- Publishes lifecycle events to the `lesson.service` Redis stream.
- Consumes `auth.events` to cascade-delete lessons when a user is deleted.
- Exposes Prometheus metrics for observability.

## Documentation map

| Document | What it covers |
|----------|----------------|
| [`database.md`](database.md) | Mermaid ER diagram and field dictionary for every table. |
| [`api.md`](api.md) | Full REST API reference: routes, request/response shapes, auth rules, errors. |
| [`events.md`](events.md) | Event catalog and Redis broker stream contract. |
| [`integrations.md`](integrations.md) | External service contracts (auth, user, file, Redis). |
| [`configuration.md`](configuration.md) | Environment variables, Docker setup, Makefile, runbook. |

## Project structure

```
Lesson-service/
├── app/
│   ├── controllers/          # HTTP request handlers
│   │   ├── files_controller.ts
│   │   ├── lessons_controller.ts
│   │   └── searches_controller.ts
│   ├── models/               # Lucid ORM models
│   │   ├── lesson_file.ts
│   │   ├── lesson_header.ts
│   │   ├── lesson_tag.ts
│   │   ├── tag.ts
│   │   └── user.ts
│   ├── service/              # Domain operations + event generation
│   │   ├── event.ts
│   │   ├── file.ts
│   │   └── lesson.ts
│   ├── utils/                # Constants, types, error messages
│   │   ├── message.ts
│   │   └── types.ts
│   ├── validators/           # Vine request validators
│   │   ├── file_ownership.ts
│   │   └── lesson.ts
│   └── middleware/           # Auth token verification
│       └── verify_token_middleware.ts
├── config/                   # Framework configuration
│   ├── database.ts
│   └── prometheus.ts
├── database/
│   ├── migrations/           # Schema source of truth
│   ├── schema.ts             # Auto-generated Lucid schema
│   ├── schema/pg-schema.sql  # Empty placeholder
│   └── seeders/base_seeder.ts
├── providers/
│   ├── api_provider.ts       # Custom response serializer
│   └── broker_provider.ts    # Redis broker lifecycle
├── start/
│   ├── env.ts                # Environment variable schema
│   ├── kernel.ts             # Middleware registration
│   └── routes.ts             # Route definitions
├── bin/                      # Entry points
├── tests/                    # Test bootstrap
├── dockerfile
├── setup.sh
├── package.json
└── lesson_tags.csv           # Seed data for tags
```

## Architecture at a glance

```
┌─────────────────┐      Bearer token      ┌─────────────────┐
│   API clients   │ ─────────────────────> │  Auth Service   │
│  (Bruno / UI)   │                        └─────────────────┘
└────────┬────────┘                                  │
         │ verifyToken() middleware                 │
         v                                          v
┌─────────────────────────────────────────────────────────────┐
│                    Lesson Service (AdonisJS 7)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │  │ Controllers │  │  Service / Models   │  │
│  │  routes.ts  │  │ lessons.ts  │  │  lesson.ts / file   │  │
│  └──────┬──────┘  │ files.ts    │  └──────────┬──────────┘  │
│         │         │ searches.ts │             │             │
│         │         └──────┬──────┘             │             │
│         │                │                    │             │
│         └────────────────┴────────────────────┘             │
│                          │                                  │
│              PostgreSQL  │   Redis broker                   │
│              (metadata)  │   (events)                       │
└──────────────────────────┼──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           v               v               v
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ User Service│ │ File Service│ │  Prometheus │
    └─────────────┘ └─────────────┘ └─────────────┘
```

## Important note on accuracy

The existing root [`README.md`](../README.md) is out of date: it documents an older `files` table,
a hardcoded author `"1"`, and an older route layout. This documentation set is grounded in the
current source code and cites `file:line` references. Where the old README contradicts the code,
these docs state the current behaviour and flag the discrepancy.
