import { LessonHeaderSchema } from '#database/schema'
import { beforeCreate, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tag from './tag.ts'
import LessonFile from '#models/lesson_file'

export default class LessonHeader extends LessonHeaderSchema {
  @manyToMany(() => Tag, {
    pivotTable: 'lesson_tags',
    pivotForeignKey: 'lesson_id',
    pivotRelatedForeignKey: 'tag_id',
    localKey: 'lessonId',
    relatedKey: 'id',
  })
  declare tags: ManyToMany<typeof Tag>

  @hasMany(() => LessonFile, {
    foreignKey: 'lessonId',
    localKey: 'lessonId',
  })
  declare LessonFile: HasMany<typeof LessonFile>

  @beforeCreate()
  static assignUuid(lessonHeader: LessonHeader) {
    lessonHeader.lessonId = crypto.randomUUID()
  }
}
