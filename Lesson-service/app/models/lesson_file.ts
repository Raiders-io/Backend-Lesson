import { LessonFileSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import LessonHeader from './lesson_header.ts'

export default class LessonFile extends LessonFileSchema {
  @belongsTo(() => LessonHeader, {
    foreignKey: 'lessonId',
    localKey: 'lessonId',
  })
  declare LessonHeader: BelongsTo<typeof LessonHeader>
}
