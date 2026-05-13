## Architectural design
The lesson api must respond to different usage, user must be able to :
- Create new lesson page.
- Open a lesson.
- Search for a lesson.
- Preview the lesson.
- Submit a modification.
- Delete a lesson.

The lesson API must also be able to identify the user and his permission, like deleting, modifying or even browsing (private lesson ?).

#### Roles
**Author**: Must be able to modify, delete, see the lessons.
**Editor**: Must be able to modify or ask for deletion.
**User**": Must be able to see the lessons and ask for a modification.
**Mod**: Moderator, can delete, hide, revert to precedent version.

#### Design
The lesson in this service will be a file stored elsewhere.
This api will store in a db the lesson:
- name
- tag
- author
- exercice
- date

### DB requirement

Recommendation from gemini: **PostgreSQL**

| **Table**          | **Purpose**                | **Key Fields**                                                          |
| ------------------ | -------------------------- | ----------------------------------------------------------------------- |
| **Lessons**        | The "Header" record.       | `id`, `slug`, `author_id`, `current_version_id`, `is_private`           |
| **LessonVersions** | Tracks history.            | `id`, `lesson_id`, `content_ref` (file path), `editor_id`, `created_at` |
| **LessonTags**     | For $O(\log n)$ searching. | `lesson_id`, `tag_name`                                                 |
