import { LessonFileSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import LessonHeader from './lesson_header.ts'

/**
 * The `lesson_files` table has a composite primary key `(filename, lesson_id)`,
 * but Lucid models only support a single primary key, so the generated schema
 * marks `filename` as primary. Do not use instance methods (`save`, `delete`,
 * `find`, ...) on this model: they would match on `filename` alone. Always use
 * query-builder calls scoped by both columns.
 */
export default class LessonFile extends LessonFileSchema {
  @belongsTo(() => LessonHeader, {
    foreignKey: 'lessonId',
    localKey: 'lessonId',
  })
  declare LessonHeader: BelongsTo<typeof LessonHeader>
}
