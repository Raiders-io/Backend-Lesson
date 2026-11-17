/**
 * Returns true when the given error is a database unique constraint violation.
 *
 * PostgreSQL reports unique violations with SQLSTATE `23505`. We use this to
 * translate the constraint added on `lesson_headers (author_id, slug)` into a
 * proper conflict response instead of a generic bad request.
 */
export function isUniqueViolation(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const { code, message } = error as { code?: unknown; message?: unknown }
  return (
    code === '23505' || (typeof message === 'string' && message.includes('duplicate key value'))
  )
}
