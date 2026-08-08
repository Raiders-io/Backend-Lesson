# Pending Tasks for the Lesson Service

## Summary of the current state

The repository already includes a working foundation for a lesson-management microservice built with AdonisJS. The main parts that are already implemented are:

- Project setup and service structure for the Lesson Service
- Authentication flow for sign-up, login, logout, and profile retrieval
- Lesson CRUD operations: create, list, read, update, and delete
- Tag management and lesson-tag associations
- Search support for lessons, including tag-based filtering
- File metadata association with lessons through the database
- Database migrations and models for users, lessons, tags, files, and access tokens

## Immediate blockers and known gaps

The codebase is not yet production-ready from a completeness and reliability standpoint. The most important gaps are:

- The application still uses a hardcoded author placeholder (`"1"`) instead of the authenticated user identity
- Private lesson access control is not implemented yet
- The files controller still has an incomplete update flow
- File storage is only modeled as database metadata; it is not yet integrated with an external storage service
- The current TypeScript check fails because of a few controller issues
- There are no real automated tests yet for the API behavior

## Pending tasks by priority

### High priority

- [X] Replace hardcoded author IDs with the authenticated user ID in the lesson and file workflows
- [ ] Enforce real authorization for lesson ownership during create, update, delete, and file operations
- [ ] Implement private lesson visibility rules so users can access their own private lessons while others only see public content
- [ ] Complete the `update` action in `Lesson-service/app/controllers/files_controller.ts`
- [ ] Integrate file handling with an external storage service instead of only persisting metadata
- [ ] Fix the TypeScript issues currently reported by `npm run typecheck`
- [ ] Add automated tests for authentication, lesson CRUD, search, and file operations

### Medium priority

- [ ] Implement role-based access control for Editors and Moderators
- [ ] Add lesson versioning and allow reverting to earlier versions
- [ ] Support modification requests from Editors with review/change tracking
- [ ] Implement relevance-based sorting for search results using a real `pertinence` strategy
- [ ] Add database-level pagination optimization for large result sets
- [ ] Add request logging and API rate limiting

### Low priority

- [ ] Add a lesson preview endpoint with limited access rules
- [ ] Support bulk operations for lessons, tags, and files
- [ ] Add advanced search filters such as date range, author, and nested tag filters
- [ ] Add lesson templates for faster content creation
- [ ] Add export features such as Markdown or PDF export
- [ ] Add analytics for views, popularity, and engagement

## Logical issues and incomplete implementations found

The current implementation already shows several correctness issues that should be fixed before the service can be considered reliable:

- The lessons and files endpoints are not protected by authentication middleware, so anonymous users can create, update, or delete lessons and files.
- Lesson ownership is still based on a hardcoded author placeholder (`"1"`) instead of the authenticated user, which makes authorization unreliable.
- The file workflow has multiple data-shape bugs:
  - file records are created with `filename` instead of the schema field `fileName` / `file_name`
  - file association uses `lesson.id` instead of `lesson.lessonId` / `lesson_id`, which is the UUID foreign key stored in the database
  - file deletion uses the wrong route parameter for the file identifier
- The lessons update flow can unintentionally clear tags because it calls `sync(tags)` even when no tags were provided in the request.
- The lessons list endpoint exposes all lessons without applying privacy rules, which is inconsistent with the search endpoint.
- The files controller has a stubbed `update` action, so the update endpoint is incomplete.
- The file routes are mounted under `/lesson/:id` while the main lesson resource uses `/lessons`, creating an inconsistent API shape.
- The search endpoint only returns public lessons and does not yet support owner access to private lessons.

These issues should be treated as high-priority fixes because they affect security, data integrity, and API correctness.

## Specific implementation notes

### 1. Authentication and ownership integration

The current lesson controller uses a placeholder author ID and compares it against a hardcoded value. This must be replaced with the authenticated user from the auth middleware so that ownership is real and consistent across the API.

Relevant files:
- `Lesson-service/app/controllers/lessons_controller.ts`
- `Lesson-service/app/controllers/files_controller.ts`

### 2. Private lesson access control

The search endpoint is currently hardcoded to only return public lessons. The next step is to allow the owner to see their own private lessons, while keeping other users restricted to public content.

Relevant file:
- `Lesson-service/app/controllers/searches_controller.ts`

### 3. File workflow completion

The file controller currently stores file references in the database, but the update route is empty and file storage integration is still missing. This should be completed before the files feature is considered complete.

Relevant file:
- `Lesson-service/app/controllers/files_controller.ts`

### 4. Quality and reliability

The project should be brought back to a healthy state by fixing the current TypeScript errors and adding a test suite for the core endpoints.

Relevant files:
- `Lesson-service/app/controllers/files_controller.ts`
- `Lesson-service/app/controllers/lessons_controller.ts`
- `Lesson-service/tests/`

## Suggested order of execution

1. Fix current TypeScript errors
2. Replace placeholder author handling with real authenticated users
3. Implement private lesson visibility rules
4. Complete file update and storage integration
5. Add tests and permission checks
6. Deliver the remaining medium and low-priority features
