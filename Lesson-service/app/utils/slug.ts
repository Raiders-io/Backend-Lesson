/**
 * Builds a URL-safe slug from a lesson title.
 *
 * Spaces and underscores become dashes, unsupported characters are removed,
 * and leading/trailing or repeated dashes are collapsed. The result can be
 * empty for titles made only of unsupported characters, so callers must
 * check for that case.
 */
export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
