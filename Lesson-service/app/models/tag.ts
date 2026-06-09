import { TagSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import LessonHeader from './lesson_header.ts'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Tag extends TagSchema {
  @manyToMany(() => LessonHeader, {
    pivotTable: 'lesson_tags',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'lesson_id',
    localKey: 'id',
    relatedKey: 'lessonId',
  })
  declare lessons: ManyToMany<typeof LessonHeader>
}
