# External Service Integrations

The Lesson Service relies on four external systems: the Auth Service for token verification, the
User Service for username lookup, the File Service for object ownership checks, and Redis for the
broker. All integration details below are taken from the current source code.

## Auth Service

Validates bearer tokens on every request.

**Endpoint:** `GET ${AUTH_SERVICE_URL}/api/v1/auth/verify`

**Request headers:**

```
Authorization: Bearer <token>
```

**Response body (expected):**

```json
{
  "data": {
    "userId": "<uuid>"
  }
}
```

**Behaviour:**

- The `verifyToken()` helper parses the `Authorization` header, strips the `Bearer ` prefix, and
  forwards the token to the Auth Service ([`verify_token_middleware.ts:5-17`](../Lesson-service/app/middleware/verify_token_middleware.ts)).
- If the service returns a non-OK response or throws, `verifyToken()` returns `null`.
- The middleware stores the resulting `userId` in `ctx.userId`, or `undefined` if verification
  failed ([`verify_token_middleware.ts:34-47`](../Lesson-service/app/middleware/verify_token_middleware.ts)).

Default value from [`start.sh`](../start.sh):

```
AUTH_SERVICE_URL=http://auth-service:3333
```

## User Service

Supplies the username used to lazily populate the local `users` shadow table.

**Endpoint:** `GET ${USER_SERVICE_URL}/api/v1/profile/me`

**Request headers:**

```
Authorization: Bearer <token>
```

**Response body (expected):**

```json
{
  "username": "jdoe"
}
```

Source: [`verify_token_middleware.ts:19-31`](../Lesson-service/app/middleware/verify_token_middleware.ts)

Default value from [`start.sh`](../start.sh):

```
USER_SERVICE_URL=http://user-service:3333
```

**Behaviour:**

- `verifyToken()` is called on every request and sets `ctx.userId`.
- On lesson creation, if the user is missing locally, `getUsername()` is called to backfill the
  `users` table.

## File Service

Verifies that the caller owns files before attaching them to a lesson.

**Endpoint:** `POST ${FILE_SERVICE_URL}${FILE_VERIFY_ROUTE_URL}`

The concrete URL is built at runtime:

```ts
const verifyRouteURL = `${env.get('FILE_SERVICE_URL')}${env.get('FILE_VERIFY_ROUTE_URL')}`
```

Source: [`app/utils/types.ts:6`](../Lesson-service/app/utils/types.ts)

Default values from [`start.sh`](../start.sh):

```
FILE_SERVICE_URL=http://file-service:3333
FILE_VERIFY_ROUTE_URL=/api/v1/storage/objects/search
```

**Request headers:**

```
Content-Type: application/json
Authorization: <same bearer token as the incoming request>
```

**Request body:**

```json
{
  "files": ["CV.pdf", "notes.md"],
  "userId": "<uuid>"
}
```

**Response body (validated):**

```json
{
  "found": ["CV.pdf"],
  "notfound": ["notes.md"]
}
```

Validator: [`app/validators/file_ownership.ts:3-6`](../Lesson-service/app/validators/file_ownership.ts)

**Usage:**

- `FilesController.store()` calls `verifyFilesOwnership()` and rejects the request if `found` is empty ([`files_controller.ts:55-58`](../Lesson-service/app/controllers/files_controller.ts)).
- `FilesController.destroy()` and `destroyByFile()` have the ownership check commented out; they rely on the lesson-author check instead.

## Redis broker

The service uses `@yosone/broker` over Redis Streams.

**Connection:**

```ts
Broker.init({
  group: env.get('CONSUMER_GROUP'),
  consumer: env.get('CONSUMER_NAME'),
  redisUrl: env.get('REDIS_HOST') + ':' + env.get('REDIS_PORT'),
  logLevel: LOGLEVEL.ERROR,
})
```

Source: [`providers/broker_provider.ts:29-34`](../Lesson-service/providers/broker_provider.ts)

**Streams:**

| Stream | Direction | Purpose |
|--------|-----------|---------|
| `lesson.service` | Publish | Lesson and file lifecycle events. |
| `auth.events` | Consume | React to `auth.user.deleted` and `auth.user.updated`. |

Default Redis values from [`start.sh`](../start.sh):

```
REDIS_HOST=redis://redis
REDIS_PORT=6379
CONSUMER_NAME=lesson-service-consumer
CONSUMER_GROUP=lesson-service
```

## Why the local `users` table exists

The Lesson Service does not manage authentication or user profiles. It keeps a minimal `users`
shadow table (`id`, `username`) so that:

1. Routes such as `/lessons/cnt/:author` can resolve a username to a user ID without calling the User Service on every request.
2. Foreign-key relationships from `lesson_headers.author_id` to `users.id` can be enforced by the database.
3. The `author` relation can be preloaded cheaply for responses.

The table is populated lazily: when an authenticated user creates their first lesson, the controller
calls `getUsername()` with their bearer token and inserts `{ id: userId, username }`
([`lessons_controller.ts:102-110`](../Lesson-service/app/controllers/lessons_controller.ts)).

## Failure behaviour summary

| Integration | Failure mode | Service behaviour |
|-------------|--------------|-------------------|
| Auth Service | Down or returns non-OK | `ctx.userId` set to `undefined`; mutations requiring auth return `401`. |
| User Service | Down when backfilling user | Returns `500 Unable to fetch user info for the given userId`. |
| File Service | Down during ownership check | Returns `500 Failed to verify ownership`. |
| File Service | `notfound` contains all files | Returns `403 You do not own any of the provided files`. |
| Redis broker | Down during publish | Event is dropped, error logged, DB transaction still commits. |
| Redis broker | Down during consume | Consumer cannot start; application startup may fail. |
