import factory from '@adonisjs/lucid/factories'
import LessonHeader from '#models/lesson_header'
import Tag from '#models/tag'
import { TagFactory } from './tag_factory.ts'

export const LessonHeaderFactory = factory
  .define(LessonHeader, async ({ faker }) => {
    const title = faker.lorem.sentence({min:3, max:6})
    return {
      title: title,
      slug: faker.helpers.slugify(title),
      authorId: crypto.randomUUID(),
      isPrivate: faker.datatype.boolean(),
      lessonId: crypto.randomUUID(),
    }
  })
  .relation('tags', () => TagFactory) 
  .build()