# Configuration and Operations

This document covers environment variables, Docker setup, the Makefile, Prometheus metrics, and a
quick-start runbook for local development.

## Environment variables

All environment variables are validated by `Env.create()` in
[`start/env.ts`](../Lesson-service/start/env.ts). Variables marked **Required** must be present;
the others are also required by the `Env.create` schema unless noted.

### Node / server

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NODE_ENV` | enum `development` \| `production` \| `test` | Yes | Runtime environment. |
| `PORT` | number | Yes | Port the AdonisJS server listens on. |
| `HOST` | host string | Yes | Bind host, e.g. `0.0.0.0`. |
| `LOG_LEVEL` | string | Yes | Pino log level (`debug`, `info`, `warn`, `error`, `fatal`). |

### Application

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `APP_KEY` | secret | Yes | 32-character application key for encryption/sessions. |
| `APP_URL` | URL | Yes | Public base URL of the service. |

### Session

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `SESSION_DRIVER` | enum `cookie` \| `memory` \| `database` | Yes | Where sessions are stored. |

### Database

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `DB_CONNECTION` | enum `pg` | Yes | Database driver (only PostgreSQL is configured). |
| `DB_HOST` | host string | Yes | PostgreSQL host. |
| `DB_PORT` | number | Yes | PostgreSQL port. |
| `DB_USER` | string | Yes | Database user. |
| `DB_PASSWORD` | string | Yes | Database password. |
| `DB_DATABASE` | string | Yes | Database name. |

### External services

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `AUTH_SERVICE_URL` | URL | Yes | Base URL of the Auth Service. |
| `USER_SERVICE_URL` | URL | Yes | Base URL of the User Service. |
| `FILE_SERVICE_URL` | URL | Yes | Base URL of the File Service. |
| `FILE_VERIFY_ROUTE_URL` | string | Yes | Path appended to `FILE_SERVICE_URL` for ownership checks. |

### Message broker (Redis)

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `REDIS_HOST` | string | Yes | Redis host, e.g. `redis://redis`. |
| `REDIS_PORT` | number | Yes | Redis port. |
| `CONSUMER_NAME` | string | Yes | Broker consumer name. |
| `CONSUMER_GROUP` | string | Yes | Broker consumer group. |

### Seeding

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `TAG_FILE` | string | Yes | Path to the CSV file used to seed tags. |

### Timezone

The `start.sh` script sets `TZ=UTC`; this is used by the container runtime and PostgreSQL.

## `.env.example`

Copy this block and adapt hostnames for your Docker network:

```env
# Node / server
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
TZ=UTC

# App
APP_KEY=<32-char-secret>
APP_URL=http://localhost:3333

# Session
SESSION_DRIVER=memory

# Database
DB_CONNECTION=pg
DB_HOST=postgresql
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<strong-password>
DB_DATABASE=lesson_service

# External services
AUTH_SERVICE_URL=http://auth-service:3333
USER_SERVICE_URL=http://user-service:3333
FILE_SERVICE_URL=http://file-service:3333
FILE_VERIFY_ROUTE_URL=/api/v1/storage/objects/search

# Message broker
REDIS_HOST=redis://redis
REDIS_PORT=6379
CONSUMER_NAME=lesson-service-consumer
CONSUMER_GROUP=lesson-service

# Seeding
TAG_FILE=./lesson_tags.csv
```

Source: [`start/env.ts`](../Lesson-service/start/env.ts)

## Docker setup

### `docker-compose.yml`

The compose file defines two services:

- **`lesson-api`** — builds the `lesson_api:local` image from `Lesson-service/dockerfile` and
  exposes `${PORT}:3333`.
- **`postgresql`** — runs `postgres:18.4-alpine3.23` with a persistent `pg-data` volume.

Networks:

- `default-network` — internal bridge for service-to-service communication.
- `api-network` — external network shared with other ft_transcendence microservices.

Source: [`docker-compose.yml`](../docker-compose.yml)

### `Lesson-service/dockerfile`

Multi-stage build:

1. **`base`** — `node:24.16.0-bookworm-slim`.
2. **`deps`** — installs dependencies with `npm ci`.
3. **`build`** — copies the source and runs `node ace build`.
4. **`production`** — copies the build output, `setup.sh`, and `lesson_tags.csv`; runs
   `npm ci --omit=dev`; exposes port `3333`; entrypoint is `/app/setup.sh`.

Source: [`Lesson-service/dockerfile`](../Lesson-service/dockerfile)

### `setup.sh`

Container entrypoint executed by the production stage:

1. Runs migrations: `node ace.js migration:run --force`.
2. Seeds the database: `node ace.js db:seed || true`.
3. Starts the server:
   - Production: `exec node bin/server.js`
   - Development: `exec npm run dev`

Source: [`Lesson-service/setup.sh`](../Lesson-service/setup.sh)

### `start.sh`

Root-level orchestration script:

1. Generates a `.env` file (interactive by default; `-i` for non-interactive).
2. Runs `docker compose up -d --build --remove-orphans`.

Flags:

- `-i`, `--non-interactive` — use default values, no prompts.
- `-f`, `--force` — regenerate `.env` even if it exists.
- `-h`, `--help` — show usage.

Source: [`start.sh`](../start.sh)

## Makefile

| Target | What it does |
|--------|--------------|
| `make all` | Creates the `api-network` (if missing) and runs `./start.sh -i`. |
| `make status` | Lists Docker images and running containers. |
| `make stop` | Stops the compose stack. |
| `make down` | Stops the stack, removes volumes, and removes `api-network`. |

Source: [`Makefile`](../Makefile)

## Prometheus metrics

Metrics are exposed by `@julr/adonisjs-prometheus`.

| Setting | Value |
|---------|-------|
| Endpoint | `private/lesson/metrics` |
| Metric prefix | `lessonApi_` |
| IP whitelist | empty (open to all) |
| Collectors | HTTP, mail, Lucid, system |

Source: [`config/prometheus.ts`](../Lesson-service/config/prometheus.ts)

## Quick start

### 1. Start the whole stack

```bash
make all
```

This generates `.env`, builds the image, creates the network, and starts the containers.

### 2. Check status

```bash
make status
```

### 3. Stop / tear down

```bash
make stop      # stop containers
make down      # stop and remove containers + volumes + network
```

### 4. Local development (without Docker)

From inside `Lesson-service/`:

```bash
# Install dependencies
npm install

# Create .env (see example above)

# Run migrations
npm run migration

# Seed tags
npm run seed

# Start dev server with hot reload
npm run dev
```

### 5. Run tests and quality checks

From inside `Lesson-service/`:

```bash
# Tests
npm run test

# Lint
npm run lint

# Format
npm run format

# Type check
npm run typecheck

# Production build
npm run build
```

## Runbook

### Service cannot connect to PostgreSQL

- Verify the container is healthy: `docker compose ps`.
- Check credentials in `.env` match `docker-compose.yml`.
- Inspect logs: `docker compose logs postgresql`.

### Migrations fail on startup

- `setup.sh` runs `node ace.js migration:run --force`; check the container logs.
- Ensure `DB_HOST` resolves inside the container (use `postgresql`, not `localhost`).

### Broker events are not published

- Confirm `REDIS_HOST` and `REDIS_PORT` are reachable from the container.
- The broker logs errors at `LOGLEVEL.ERROR`; check container logs.
- Publishing failures are caught and logged but do not roll back the DB transaction.

### `.env` keeps regenerating unexpectedly

- `start.sh` only regenerates `.env` if it is missing or if `-f`/`--force` is passed.
- In non-interactive mode (`-i`) it skips the regeneration prompt.

## Package scripts

From [`Lesson-service/package.json`](../Lesson-service/package.json):

| Script | Command |
|--------|---------|
| `start` | `node bin/server.js` |
| `build` | `node ace build` |
| `dev` | `node ace serve --hmr` |
| `seed` | `node ace db:seed` |
| `migration` | `node ace migration:run` |
| `migration-force` | `node ace migration:run --force` |
| `test` | `node ace test` |
| `lint` | `eslint .` |
| `format` | `prettier --write .` |
| `typecheck` | `tsc --noEmit` |
