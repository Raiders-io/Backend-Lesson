# Lesson Service API Documentation

A comprehensive lesson management service built with AdonisJS, providing functionality for creating, managing, and discovering educational lessons.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture](#architecture)
3. [API Reference](#api-reference)
4. [Configuration](#configuration)
5. [Database Schema](#database-schema)
6. [Work in Progress](#work-in-progress)
7. [Development](#development)

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 18+ (included in Docker setup)

### Installation

```bash
# Clone and navigate to the project
cd /home/secros/Documents/Transcendance/Backend-Lesson

# Start services using Make
make all

# Or using Docker Compose directly
docker compose up -d
```

### Environment Setup

Create a `.env` file in the `Lesson-service` directory:

```env
# Node Environment
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info

# App Configuration
APP_KEY=<generate_with_node_ace_generate:key>
APP_URL=http://localhost:3333

# Database Configuration
DB_CONNECTION=pg
DB_HOST=postgresql
DB_PORT=5432
DB_USER=lesson_user
DB_PASSWORD=lesson_password
DB_DATABASE=lesson_db

# Session Configuration
SESSION_DRIVER=memory

# Timezone
TZ=UTC
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

---

## Architecture

### Design Overview

The Lesson Service is a microservice responsible for managing lesson metadata and search capabilities. Lessons themselves are stored as files in external storage, while this service maintains the lesson headers and metadata.

**Key Principles:**

- Lessons are identified by a unique slug
- Each lesson belongs to an author with role-based permissions
- Lessons can be tagged for efficient searching and categorization
- Privacy settings control lesson visibility
- Transactions ensure data consistency when updating related data

### User Roles

| Role          | Permissions                              | Notes                                      |
| ------------- | ---------------------------------------- | ------------------------------------------ |
| **Author**    | Create, read, update, delete own lessons | Can modify and delete lessons they created |
| **Editor**    | Read, request modifications              | Can suggest changes (feature in WIP)       |
| **User**      | Read public lessons                      | Can view and search public lessons         |
| **Moderator** | Delete, hide, revert versions            | Admin capabilities (WIP)                   |

---

## API Reference

### Base URL

```
http://localhost:3333/api/v1
```

### Health Check

**GET** `/`

```
Returns: { hello: "OuiWorld" }
Status: 200
```

---

### Account Endpoints

#### Get Profile

**GET** `/account/profile`

Retrieve authenticated user's profile information.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "id": "1",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

**Errors:**

- `401 Unauthorized`: Invalid or missing token

---

#### Logout

**POST** `/account/logout`

Revoke the current access token.

**Headers:**

```
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

---

### Lesson Endpoints

#### List All Lessons

**GET** `/lessons`

Retrieve all lessons with their tags and metadata.

**Response (200 OK):**

```json
[
  {
    "lessonId": "uuid",
    "title": "Introduction to JavaScript",
    "slug": "introduction-to-javascript",
    "authorId": "1",
    "isPrivate": false,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-01-15T10:30:00Z",
    "tags": [
      {
        "id": "tag-uuid",
        "name": "javascript"
      },
      {
        "id": "tag-uuid",
        "name": "beginner"
      }
    ]
  }
]
```

---

#### Get Lesson by ID/Slug

**GET** `/lessons/{id}`

Retrieve a specific lesson by its ID or slug.

**Path Parameters:**

- `id`: Lesson ID or slug (string)

**Response (200 OK):**

```json
{
  "lessonId": "uuid",
  "title": "Introduction to JavaScript",
  "slug": "introduction-to-javascript",
  "authorId": "1",
  "isPrivate": false,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z",
  "tags": [
    {
      "id": "tag-uuid",
      "name": "javascript"
    }
  ]
}
```

**Errors:**

- `404 Not Found`: Lesson does not exist

---

#### Get Lessons by Tags

**GET** `/lessons/tags?tags=javascript&tags=beginner`

Retrieve lessons filtered by one or multiple tags.

**Query Parameters:**

- `tags`: Tag name or array of tag names (string or array)

**Response (200 OK):**

```json
[
  {
    "lessonId": "uuid",
    "title": "Introduction to JavaScript",
    "slug": "introduction-to-javascript",
    "authorId": "1",
    "isPrivate": false,
    "tags": [...]
  }
]
```

**Errors:**

- `400 Bad Request`: No tags provided
- `404 Not Found`: No lessons with specified tags

---

#### Create Lesson

**POST** `/lessons`

Create a new lesson.

**Request Body:**

```json
{
  "title": "Advanced TypeScript",
  "tags": ["typescript", "advanced", "intermediate"],
  "privacy": false
}
```

**Response (201 Created):**

```json
{
  "lessonId": "newly-generated-uuid"
}
```

**Validation:**

- `title`: Required, string
- `tags`: Required, non-empty array of tag IDs
- `privacy`: Optional, boolean (default: false)

**Notes:**

- Slug is automatically generated from the title
- Author ID is currently hardcoded as "1" (WIP: integrate with User Service)
- At least one tag is required

**Errors:**

- `400 Bad Request`: Missing required fields or invalid tag array

---

#### Update Lesson

**PUT** `/lessons/{id}`

Update an existing lesson.

**Path Parameters:**

- `id`: Lesson ID (UUID)

**Request Body:**

```json
{
  "title": "Advanced TypeScript Updated",
  "tags": ["typescript", "advanced"],
  "privacy": true
}
```

**Response (200 OK):**

```json
{
  "message": "Lesson updated successfully"
}
```

**Authorization:**

- Only the lesson author can update the lesson
- Author ID is currently checked against hardcoded "1" (WIP)

**Validation:**

- `title`: Optional, string
- `tags`: Optional, must be non-empty if provided
- `privacy`: Optional, boolean

**Errors:**

- `403 Forbidden`: Unauthorized to update (not the author)
- `400 Bad Request`: Invalid tag array
- `404 Not Found`: Lesson not found

---

#### Delete Lesson

**DELETE** `/lessons/{id}`

Delete a lesson.

**Path Parameters:**

- `id`: Lesson ID (UUID)

**Response (200 OK):**

```json
{
  "message": "Lesson deleted successfully"
}
```

**Authorization:**

- Only the lesson author can delete the lesson

**Errors:**

- `400 Bad Request`: Unauthorized to delete
- `404 Not Found`: Lesson not found

---

### Search Endpoint

#### Search Lessons

**GET** `/search`

Search for lessons by title and/or tags with pagination and sorting.

**Query Parameters:**

- `title` (or `name`): Search term for lesson title (case-insensitive)
- `tags`: Tag name or array of tag names
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sortBy`: Sort field - `created_at`, `updated_at`, `title`, `name`, `pertinence` (default: `created_at`)
- `direction`: Sort direction - `asc` or `desc` (default: `desc`)

**Example Request:**

```
GET /search?title=javascript&tags=beginner&page=1&limit=10&sortBy=created_at&direction=desc
```

**Response (200 OK):**

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
  "data": [
    {
      "lessonId": "uuid",
      "title": "JavaScript Basics",
      "slug": "javascript-basics",
      "authorId": "1",
      "isPrivate": false,
      "tags": [
        {
          "id": "tag-uuid",
          "name": "javascript"
        }
      ]
    }
  ]
}
```

**Features:**

- Case-insensitive title search with ILIKE operator
- Multiple tag filtering (AND logic)
- Only searches public lessons (privacy handling WIP)
- Supports multiple sort fields and directions

---

## Configuration

### Environment Variables

#### Node Configuration

```env
NODE_ENV=development          # development, production, or test
PORT=3333                     # Server port
HOST=0.0.0.0                  # Server host
LOG_LEVEL=info                # debug, info, warn, error, fatal
```

#### Application Configuration

```env
APP_KEY=<32-char-secret>      # Generated application key for encryption
APP_URL=http://localhost:3333 # Base URL for the application
```

#### Database Configuration

```env
DB_CONNECTION=pg              # Database driver (PostgreSQL)
DB_HOST=postgresql            # Database host (or IP)
DB_PORT=5432                  # PostgreSQL default port
DB_USER=lesson_user           # Database user
DB_PASSWORD=lesson_password   # Database password
DB_DATABASE=lesson_db         # Database name
```

#### Session Configuration

```env
SESSION_DRIVER=memory         # memory, cookie, or database
```

#### Other

```env
TZ=UTC                        # Timezone for database and logs
```

### Docker Configuration

The `docker-compose.yml` includes:

- **lesson-api**: AdonisJS application on port 3333
- **postgresql**: PostgreSQL 18.4 on port 5432

**Networks:**

- `default-network`: Internal network for service communication
- `public-network`: Shared network with other microservices

### Makefile Commands

```bash
make all      # Create public network and start all services
make status   # Show running containers and images
make stop     # Stop all services
make down     # Stop and remove all services and network
```

---

## Database Schema

### Tables

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Lesson Headers Table

```sql
CREATE TABLE lesson_headers (
  lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tags Table

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Lesson Tags (Pivot) Table

```sql
CREATE TABLE lesson_tags (
  lesson_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (lesson_id, tag_id),
  FOREIGN KEY (lesson_id) REFERENCES lesson_headers(lesson_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

#### Access Tokens Table

```sql
CREATE TABLE access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_identifier VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Files Table

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lesson_headers(lesson_id) ON DELETE CASCADE
);
```

---

## Work in Progress

### High Priority

- [ ] **Author ID Integration**: Replace hardcoded "1" with actual user ID from authentication (affects `/lessons`, `/lessons/{id}`, and update/delete authorization)
- [ ] **Private Lesson Access Control**: Implement permission checks to allow users to access their private lessons in search and get endpoints
- [ ] **Files Controller Implementation**: Complete file upload, retrieval, update, and deletion endpoints
- [ ] **File Service Integration**: Integrate with external file storage service for lesson content

### Medium Priority

- [ ] **Role-Based Access Control**: Implement Editor and Moderator roles with appropriate permissions
- [ ] **Lesson Versioning**: Track lesson history and allow reverting to previous versions
- [ ] **Modification Requests**: Allow Editors to request modifications with change tracking
- [ ] **Pertinence Sorting**: Implement relevance-based sorting for search results
- [ ] **Pagination Optimization**: Add database-level cursor pagination for large datasets
- [ ] **API Rate Limiting**: Implement rate limiting to prevent abuse
- [ ] **Request Logging**: Add comprehensive request/response logging for debugging

### Low Priority

- [ ] **Lesson Preview Endpoint**: Implement preview functionality without full access requirements
- [ ] **Batch Operations**: Support bulk delete, update, and tag operations
- [ ] **Advanced Search Filters**: Add date range, author, and nested tag filtering
- [ ] **Lesson Templates**: Allow creating lessons from templates
- [ ] **Export Functionality**: Support exporting lessons in various formats (PDF, Markdown, etc.)
- [ ] **Analytics**: Track lesson views and popular lessons

### Known Issues

- Database port 5432 is commented out in docker-compose.yml for production safety
- Author authorization checks are not integrated with actual user service
- Private lesson access is not enforced in search results

---

## Development

### Project Structure

```
Lesson-service/
├── app/
│   ├── controllers/          # Request handlers
│   ├── models/               # Database models
│   ├── validators/           # Input validation rules
│   ├── transformers/         # Response formatting
│   ├── middleware/           # HTTP middleware
│   └── exceptions/           # Custom exceptions
├── config/                   # Configuration files
├── database/
│   ├── migrations/           # Database migrations
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories for testing
├── start/
│   ├── routes.ts             # Route definitions
│   ├── kernel.ts             # Middleware registration
│   └── env.ts                # Environment validation
├── bin/
│   ├── server.ts             # Server entry point
│   └── test.ts               # Test runner
└── tests/                    # Test files
```

### Running Migrations

```bash
# Create migration
node ace make:migration create_migration_name

# Run pending migrations
node ace migration:run

# Rollback last batch
node ace migration:rollback

# Rollback all migrations
node ace migration:rollback --batch 0
```

### Creating Seeders

```bash
# Create seeder
node ace make:seeder SeedName

# Run seeders
node ace db:seed
```

### Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch
```

### Code Quality

```bash
# Check for lint issues
npm run lint

# Fix lint issues automatically
npm run lint -- --fix

# Format code
npm run format

# Type checking
npm run typecheck
```

---

## Troubleshooting

### Database Connection Issues

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:

- Ensure PostgreSQL container is running: `docker compose ps`
- Check database credentials in `.env`
- Verify network connectivity: `docker network ls`

### Migration Failures

**Error**: `Migration failed`

**Solution**:

- Check migration files for syntax errors
- Ensure database exists
- Review database logs: `docker compose logs postgresql`

### Port Already in Use

**Error**: `Address already in use :::3333`

**Solution**:

- Kill process on port 3333: `lsof -ti:3333 | xargs kill -9`
- Or change PORT in `.env`
