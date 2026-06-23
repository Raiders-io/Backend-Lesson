import { LessonHeaderSchema } from '#database/schema'
import { beforeCreate, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tag from './tag.ts'
import File from '#models/file'

export default class LessonHeader extends LessonHeaderSchema {
  @manyToMany(() => Tag, {
    pivotTable: 'lesson_tags',
    pivotForeignKey: 'lesson_id',
    pivotRelatedForeignKey: 'tag_id',
    localKey: 'lessonId',
    relatedKey: 'id',
  })
  declare tags: ManyToMany<typeof Tag>

  @hasMany(() => File)
  declare files: HasMany<typeof File>

  @beforeCreate()
  static assignUuid(lessonHeader: LessonHeader) {
    lessonHeader.lessonId = crypto.randomUUID()
  }
}
