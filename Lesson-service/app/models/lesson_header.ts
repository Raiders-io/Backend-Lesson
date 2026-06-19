import { LessonHeaderSchema } from '#database/schema'
import { beforeCreate, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Tag from './tag.ts'

export default class LessonHeader extends LessonHeaderSchema {
  @manyToMany(() => Tag, {
    pivotTable: 'lesson_tags',
    pivotForeignKey: 'lesson_id',
    pivotRelatedForeignKey: 'tag_id',
    localKey: 'lessonId',
    relatedKey: 'id',
  })
  declare tags: ManyToMany<typeof Tag>

  @beforeCreate()
  static assignUuid(lessonHeader: LessonHeader) {
    lessonHeader.lessonId = crypto.randomUUID()
  }
}
