# Events and Broker Contract

The Lesson Service uses Redis Streams via `@yosone/broker`. It publishes its own lifecycle events on the `lesson.service` stream and consumes user lifecycle events from the `auth.events` stream.

## Stream configuration

| Setting | Value | Source |
|---------|-------|--------|
| Publish stream | `lesson.service` | [`app/utils/types.ts:5`](../Lesson-service/app/utils/types.ts) |
| Consumer group | `CONSUMER_GROUP` env var | [`providers/broker_provider.ts:30`](../Lesson-service/providers/broker_provider.ts) |
| Consumer name | `CONSUMER_NAME` env var | [`providers/broker_provider.ts:31`](../Lesson-service/providers/broker_provider.ts) |
| Redis URL | `REDIS_HOST:REDIS_PORT` | [`providers/broker_provider.ts:32`](../Lesson-service/providers/broker_provider.ts) |
| Log level | `LOGLEVEL.ERROR` | [`providers/broker_provider.ts:33`](../Lesson-service/providers/broker_provider.ts) |
| Publish retry options | `{ retry: 3, retryTime: 1000 }` | [`app/utils/types.ts:8-11`](../Lesson-service/app/utils/types.ts) |

The broker is initialised in the provider's `ready()` hook
([`providers/broker_provider.ts:28-55`](../Lesson-service/providers/broker_provider.ts)).

## Published events (`lesson.service`)

All event payloads carry a UTC `date`. Event type strings are prefixed with `lesson.`.

### `lesson.started`

Sent once when the broker provider boots, before any consumer starts.

**Payload:**

```json
{
  "status": "Ok"
}
```

Source: [`providers/broker_provider.ts:36-41`](../Lesson-service/providers/broker_provider.ts)

### `lesson.created`

Sent after a lesson is successfully stored.

**Payload:**

```json
{
  "lessonId": "<uuid>",
  "authorId": "<uuid>",
  "date": "2026-01-15T10:30:00.000Z"
}
```

**Type:** `lesson.lesson.created`

Source: [`app/service/lesson.ts:31-36`](../Lesson-service/app/service/lesson.ts),
[`app/service/event.ts:24-32`](../Lesson-service/app/service/event.ts)

### `lesson.updated`

Sent after a lesson is updated.

**Payload:**

```json
{
  "lessonId": "<uuid>",
  "authorId": "<uuid>",
  "date": "2026-01-15T10:30:00.000Z"
}
```

**Type:** `lesson.lesson.updated`

Source: [`app/service/lesson.ts:92-96`](../Lesson-service/app/service/lesson.ts),
[`app/service/event.ts:35-43`](../Lesson-service/app/service/event.ts)

### `lesson.deleted`

Sent after a lesson (or all lessons by an author) is deleted.

**Payload when one lesson is deleted:**

```json
{
  "lessonId": "<uuid>",
  "authorId": "<uuid>",
  "date": "2026-01-15T10:30:00.000Z"
}
```

**Payload when a user is deleted and all their lessons are removed:**

```json
{
  "lessonId": ["<uuid-1>", "<uuid-2>"],
  "authorId": "<uuid>",
  "date": "2026-01-15T10:30:00.000Z"
}
```

**Type:** `lesson.lesson.deleted`

Source:

- Single delete: [`app/service/lesson.ts:44-49`](../Lesson-service/app/service/lesson.ts)
- Bulk delete by author: [`app/service/lesson.ts:58-59`](../Lesson-service/app/service/lesson.ts)
- Event builder: [`app/service/event.ts:13-22`](../Lesson-service/app/service/event.ts)

### `file.attached`

Sent after files are attached to a lesson.

**Payload:**

```json
{
  "filename": ["CV.pdf", "notes.md"],
  "lessonId": "<uuid>",
  "authorId": "<uuid>",
  "date": "2026-01-15T10:30:00.000Z"
}
```

**Type:** `lesson.file.attached`

Source: [`app/service/file.ts:22-24`](../Lesson-service/app/service/file.ts),
[`app/service/event.ts:46-55`](../Lesson-service/app/service/event.ts)

### `file.detached`

Sent after files are detached from a lesson.

**Payload:**

```json
{
  "filename": ["CV.pdf"],
  "lessonId": "<uuid>",
  "authorId": "<uuid>",
  "date": "2026-01-15T10:30:00.000Z"
}
```

**Type:** `lesson.file.detached`

Source: [`app/service/file.ts:33-35`](../Lesson-service/app/service/file.ts),
[`app/service/event.ts:58-71`](../Lesson-service/app/service/event.ts)

### `file.deleted`

Sent after `lesson_files` rows are deleted by filename (via `DELETE /lessons/files/:file`).

**Payload:**

```json
{
  "filename": "CV.pdf",
  "lessonId": ["<uuid-1>", "<uuid-2>"],
  "authorId": "<uuid>",
  "date": "2026-01-15T10:30:00.000Z"
}
```

**Type:** `lesson.file.deleted`

Source: [`app/service/file.ts:49-51`](../Lesson-service/app/service/file.ts),
[`app/service/event.ts:74-84`](../Lesson-service/app/service/event.ts)

## Consumed events (`auth.events`)

The service registers one consumer group on the `auth.events` stream.

### `auth.user.deleted`

When a user is deleted by the Auth Service, the Lesson Service deletes every lesson whose
`author_id` matches the deleted user's ID. This cascades through the foreign keys, also removing
related `lesson_tags` and `lesson_files` rows.

**Consumed payload shape:**

```json
{
  "payload": {
    "userId": "<uuid>"
  }
}
```

Source: [`providers/broker_provider.ts:45-48`](../Lesson-service/providers/broker_provider.ts)

### `auth.user.updated`

Currently only logged; no local update is performed because the local `users` table only stores
`id` and `username`.

Source: [`providers/broker_provider.ts:50-52`](../Lesson-service/providers/broker_provider.ts)

## TypeScript interfaces

The event interfaces live in [`app/utils/types.ts:39-94`](../Lesson-service/app/utils/types.ts):

```ts
interface LessonCreatedEvent { payload: { lessonId: string; authorId: string; date: Date }; type: string }
interface LessonDeletedEvent { payload: { lessonId: string | string[]; authorId: string; date: Date }; type: string }
interface LessonUpdatedEvent { payload: { lessonId: string; authorId: string; date: Date }; type: string }
interface FileAttachedEvent  { payload: { filename: string | string[]; lessonId: string; authorId: string; date: Date }; type: string }
interface FileDetachedEvent  { payload: { filename: string | string[]; lessonId: string | string[]; authorId: string; date: Date }; type: string }
interface FileDeletedEvent   { payload: { filename: string; lessonId: string | string[]; authorId: string; date: Date }; type: string }
```

## Failure handling

Publishing is wrapped in a `try/catch`. If the broker is unavailable, the event is dropped and an
error is logged to the console, but the database transaction that triggered it still commits.
