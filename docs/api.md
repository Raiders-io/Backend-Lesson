# API Reference

Base URL: `http://localhost:3333/api/v1`

All endpoints are mounted under `/api/v1` and protected by the `verifyToken()` middleware
([`start/routes.ts:63`](../Lesson-service/start/routes.ts)). The middleware sets `ctx.userId` from
the auth-service token, so the service can enforce ownership. Responses are serialized by the custom
`ApiSerializer` in [`providers/api_provider.ts`](../Lesson-service/providers/api_provider.ts),
which wraps payloads under `data` for objects/arrays and exposes pagination metadata for Lucid
paginators.

## Route overview

| Method | Path | Controller action |
|--------|------|-------------------|
| `GET` | `/lessons/tags` | `LessonsController.showTags` |
| `GET` | `/lessons` | `LessonsController.index` |
| `POST` | `/lessons` | `LessonsController.store` |
| `GET` | `/lessons/cnt/:author` | `LessonsController.showByAuthor` |
| `GET` | `/lessons/cnt/:author/:content` | `LessonsController.showByContent` |
| `PUT` | `/lessons/cnt/:author/:content` | `LessonsController.updateByContent` |
| `DELETE` | `/lessons/cnt/:author/:content` | `LessonsController.destroyByContent` |
| `GET` | `/lessons/byId/:id` | `LessonsController.showById` |
| `PUT` | `/lessons/byId/:id` | `LessonsController.updateById` |
| `DELETE` | `/lessons/byId/:id` | `LessonsController.destroyById` |
| `GET` | `/lessons/byId/:id/files` | `FilesController.index` |
| `POST` | `/lessons/byId/:id/files` | `FilesController.store` |
| `DELETE` | `/lessons/byId/:id/files` | `FilesController.destroy` |
| `GET` | `/lessons/byId/:id/files/:file` | `FilesController.show` |
| `DELETE` | `/lessons/files/:file` | `FilesController.destroyByFile` |
| `GET` | `/lessons/files/:file` | `FilesController.showLessons` |
| `GET` | `/search` | `SearchesController.index` |

Source: [`start/routes.ts:14-62`](../Lesson-service/start/routes.ts)

## Authentication

Every request must include a valid bearer token:

```
Authorization: Bearer <token-from-auth-service>
```

The token is verified against `AUTH_SERVICE_URL/api/v1/auth/verify`
([`verify_token_middleware.ts:7`](../Lesson-service/app/middleware/verify_token_middleware.ts)). If
the token is missing or invalid, `ctx.userId` is set to `undefined`; some endpoints then treat the
caller as anonymous, others reject the request.

---

## Tags

### `GET /lessons/tags`

Returns every tag in the database.

**Response (`200 OK`):**

```json
[
  { "id": 1, "name": "javascript", "createdAt": "...", "updatedAt": "..." }
]
```

Source: [`lessons_controller.ts:75-79`](../Lesson-service/app/controllers/lessons_controller.ts)

---

## Lessons

### `GET /lessons`

List lessons.

- **Authenticated caller:** returns lessons authored by `ctx.userId` (public and private).
- **Anonymous caller:** returns all public lessons (`is_private = false`).

**Response (`200 OK`):**

```json
{
  "data": [
    {
      "lessonId": "uuid",
      "title": "...",
      "slug": "...",
      "description": "...",
      "authorId": "uuid",
      "isPrivate": false,
      "pertinence": 0,
      "createdAt": "...",
      "updatedAt": "...",
      "tags": [ { "id": 1, "name": "javascript" } ],
      "author": { "id": "uuid", "username": "..." }
    }
  ]
}
```

Source: [`lessons_controller.ts:17-30`](../Lesson-service/app/controllers/lessons_controller.ts)

### `POST /lessons`

Create a new lesson. Requires authentication.

**Request body:**

```json
{
  "title": "Introduction to TypeScript",
  "description": "Optional short description",
  "privacy": false,
  "tags": [
    { "id": 1, "name": "typescript" }
  ]
}
```

Validation rules ([`app/validators/lesson.ts`](../Lesson-service/app/validators/lesson.ts)):

| Field | Rules |
|-------|-------|
| `title` | Required, alphanumeric + dashes/spaces/underscores, 1–100 chars. |
| `description` | Optional string, max 500 chars. |
| `privacy` | Required boolean. |
| `tags` | Required non-empty array, max 10 items; each item `{ id: number, name: string }`. |

**Response (`201 Created`):**

```json
{ "lessonId": "<new-uuid>" }
```

**Errors:**

- `401 Unauthorized` — caller is not authenticated.
- `500 Internal Server Error` — user service could not be reached to backfill the local `users` table.
- `409 Conflict` — a lesson with the same slug already exists for this author.
- `400 Bad Request` — validation failed.

**Notes:**

- `slug` is generated from `title` (lowercase, spaces → `-`, non-alphanumeric stripped).
- If the authenticated user does not yet exist locally, the controller fetches the username from the
  User Service and creates the row ([`lessons_controller.ts:102-110`](../Lesson-service/app/controllers/lessons_controller.ts)).

Source: [`lessons_controller.ts:96-141`](../Lesson-service/app/controllers/lessons_controller.ts)

### `GET /lessons/byId/:id`

Fetch a single lesson by UUID.

**Path parameter:** `id` — lesson UUID.

**Response (`200 OK`):** lesson object (see `GET /lessons` shape).

**Errors:**

- `404 Not Found` — lesson does not exist or is private and caller is not the author.

Source: [`lessons_controller.ts:85-91`](../Lesson-service/app/controllers/lessons_controller.ts)

### `PUT /lessons/byId/:id`

Update a lesson by UUID. Only the lesson author may update.

**Request body:** any subset of:

```json
{
  "title": "New title",
  "description": "New description",
  "privacy": true,
  "tags": [ { "id": 2, "name": "advanced" } ]
}
```

**Response (`200 OK`):**

```json
{ "message": "Operation successful" }
```

**Errors:**

- `401 Unauthorized` — caller is not authenticated.
- `403 Forbidden` — caller is not the author.
- `400 Bad Request` — validation/save error (body contains `error` message).

Source: [`lessons_controller.ts:172-195`](../Lesson-service/app/controllers/lessons_controller.ts)

### `DELETE /lessons/byId/:id`

Delete a lesson by UUID. Only the lesson author may delete.

**Response (`200 OK`):**

```json
{ "message": "Operation successful" }
```

**Errors:**

- `401 Unauthorized` — caller is not authenticated.
- `403 Forbidden` — caller is not the author.

Source: [`lessons_controller.ts:200-209`](../Lesson-service/app/controllers/lessons_controller.ts)

### `GET /lessons/cnt/:author`

List lessons by author username.

**Path parameter:** `author` — username (resolved via the local `users` table).

**Response (`200 OK`):** array of lessons visible to the caller.

**Errors:**

- `404 Not Found` — author has no visible lessons or username not found.

Source: [`lessons_controller.ts:57-70`](../Lesson-service/app/controllers/lessons_controller.ts)

### `GET /lessons/cnt/:author/:content`

Fetch a lesson by author username and content slug (`:content` is the lesson `slug`).

**Path parameters:**

- `author` — username.
- `content` — lesson slug.

**Response (`200 OK`):** lesson object.

**Errors:**

- `404 Not Found` — lesson not found or not visible.

Source: [`lessons_controller.ts:36-51`](../Lesson-service/app/controllers/lessons_controller.ts)

### `PUT /lessons/cnt/:author/:content`

Update a lesson by author username and slug. Only the authenticated author may update.

**Request body:** same as `PUT /lessons/byId/:id`.

**Response (`200 OK`):**

```json
{ "message": "Operation successful" }
```

**Errors:**

- `401 Unauthorized` — caller is not authenticated.
- `404 Not Found` — lesson not found.
- `400 Bad Request` — update failed.

Source: [`lessons_controller.ts:146-168`](../Lesson-service/app/controllers/lessons_controller.ts)

### `DELETE /lessons/cnt/:author/:content`

Delete a lesson by author username and slug.

> **Known issue:** the controller queries `.where('content', params.content)`, but the table has no `content` column; it likely intended to query by `slug`. As written, this endpoint will usually
> return `404 Not Found`.

**Response (`200 OK`):**

```json
{ "message": "Operation successful" }
```

**Errors:**

- `401 Unauthorized` — caller is not authenticated.
- `404 Not Found` — lesson not found (or the column mismatch prevents a match).

Source: [`lessons_controller.ts:211-225`](../Lesson-service/app/controllers/lessons_controller.ts)

---

## Files

File endpoints manage the association between a lesson and filenames stored in the external File
Service. They do **not** upload file bytes.

### `GET /lessons/byId/:id/files`

List all files attached to a lesson.

**Path parameter:** `id` — lesson UUID.

**Response (`200 OK`):**

```json
{
  "data": [
    { "filename": "CV.pdf", "lessonId": "uuid", "createdAt": "...", "updatedAt": "..." }
  ]
}
```

**Errors:**

- `404 Not Found` — lesson not found / not visible, or no files attached.

Source: [`files_controller.ts:32-40`](../Lesson-service/app/controllers/files_controller.ts)

### `POST /lessons/byId/:id/files`

Attach one or more files to a lesson. The caller must own the lesson, and the files must be owned
by the caller according to the File Service.

**Request body:**

```json
{
  "files": [ "CV.pdf", "notes.md" ]
}
```

**Response (`200 OK`):** array of created `lesson_files` rows.

**Errors:**

- `404 Not Found` — lesson does not exist.
- `403 Forbidden` — caller is not the lesson author, or the File Service reports no owned files.
- `400 Bad Request` — `files` array is empty.
- `500 Internal Server Error` — ownership verification request failed.

Source: [`files_controller.ts:45-60`](../Lesson-service/app/controllers/files_controller.ts)

### `DELETE /lessons/byId/:id/files`

Detach files from a lesson. The caller must be the lesson author.

> The additional File Service ownership check is currently commented out because the lesson author check is considered sufficient.

**Request body:**

```json
{
  "files": [ "CV.pdf" ]
}
```

**Response (`200 OK`):** result of the detach operation.

**Errors:**

- `404 Not Found` — lesson does not exist.
- `403 Forbidden` — caller is not the lesson author.
- `400 Bad Request` — `files` array is empty.

Source: [`files_controller.ts:90-107`](../Lesson-service/app/controllers/files_controller.ts)

### `GET /lessons/byId/:id/files/:file`

Fetch a single attached file record.

**Path parameters:**

- `id` — lesson UUID.
- `file` — filename.

**Response (`200 OK`):** `{ "data": { "filename": "...", "lessonId": "..." } }`

**Errors:**

- `404 Not Found` — lesson not visible or file not attached.

Source: [`files_controller.ts:66-75`](../Lesson-service/app/controllers/files_controller.ts)

### `GET /lessons/files/:file`

List lessons that reference a given filename.

**Path parameter:** `file` — filename.

**Response (`200 OK`):** array of visible lessons.

**Errors:**

- `404 Not Found` — filename is not attached to any visible lesson.

Source: [`files_controller.ts:77-84`](../Lesson-service/app/controllers/files_controller.ts)

### `DELETE /lessons/files/:file`

Delete all `lesson_files` rows for a filename where the caller is the lesson author.

**Path parameter:** `file` — filename.

**Response (`200 OK`):** result of the delete operation (may be empty if nothing matched).

Source: [`files_controller.ts:112-123`](../Lesson-service/app/controllers/files_controller.ts)

---

## Search

### `GET /search`

Search public lessons by title and/or tags, with pagination and sorting.

**Query parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` or `name` | string | — | Case-insensitive substring match on `title` (`ILIKE`). |
| `tags` | string or array | — | Tag names. Multiple values are combined with AND logic. |
| `page` | integer | `1` | Page number. |
| `limit` | integer | `10` | Items per page. |
| `sortBy` | string | `created_at` | One of `created_at`, `updated_at`, `title`, `name` (alias for `title`), `pertinence`. |
| `direction` | string | `desc` | `asc` or `desc`. |

**Response (`200 OK`):** Lucid paginator wrapped in `data`:

```json
{
  "meta": {
    "total": 25,
    "perPage": 10,
    "currentPage": 1,
    "lastPage": 3,
    "firstPage": 1,
    "firstPageUrl": "/search?page=1",
    "lastPageUrl": "/search?page=3",
    "nextPageUrl": "/search?page=2",
    "previousPageUrl": null
  },
  "data": [ /* lesson objects */ ]
}
```

**Notes:**

- Only public lessons are returned. Authors cannot yet search their own private lessons.
- Multiple tags use AND semantics: the lesson must have all supplied tags.

Source: [`searches_controller.ts:5-43`](../Lesson-service/app/controllers/searches_controller.ts)

---

## Error messages

Common error strings returned in the response body are defined in
[`app/utils/message.ts`](../Lesson-service/app/utils/message.ts):

| Code scenario | Message |
|---------------|---------|
| Not authenticated | `You must be log in` |
| Not author | `You are not allowed to modify this lesson` |
| User fetch failed | `Unable to fetch user info for the given userId` |
| Lesson not found | `Lesson not found` |
| No lessons by author | `No lessons found for the given author` |
| Duplicate slug | `A lesson with the same title already exists for this author` |
| File not found | `File not found` |
| No files provided | `No files provided` |
| File ownership denied | `You do not own any of the provided files` |

---

## Bruno examples

The [`BrunoConf`](../BrunoConf) collection contains runnable requests. A few representative snippets:

### Create a lesson

```bash
curl -X POST http://localhost:3333/api/v1/lessons \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Based WWorld",
    "tags": [ { "id": 1, "name": "javascript" } ]
  }'
```

### Get a lesson by ID

```bash
curl http://localhost:3333/api/v1/lessons/byId/$LESSON_ID \
  -H "Authorization: Bearer $API_TOKEN"
```

### Attach a file

```bash
curl -X POST http://localhost:3333/api/v1/lessons/byId/$LESSON_ID/files \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "files": [ "CV.pdf" ] }'
```

### Search

```bash
curl "http://localhost:3333/api/v1/search?title=world&tags=javascript&page=1&limit=10" \
  -H "Authorization: Bearer $API_TOKEN"
```

## Drift from the old root README

The old root README documents routes such as `GET /lessons/{id}` and `PUT /lessons/{id}` and states
that `authorId` is hardcoded to `"1"`. The actual routes use `/lessons/byId/:id` and `/lessons/cnt/
:author/:content`, and the author is derived from `request.ctx?.userId`.
