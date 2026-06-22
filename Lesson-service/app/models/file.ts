import { FileSchema } from '#database/schema'
import LessonHeader from './lesson_header.ts'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class File extends FileSchema {
  @belongsTo(() => LessonHeader, {
    foreignKey: 'lessonId',
  })
  declare lesson: BelongsTo<typeof LessonHeader>
}
