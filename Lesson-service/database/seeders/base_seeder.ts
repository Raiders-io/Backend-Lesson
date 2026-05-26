import { LessonHeaderFactory } from '#database/factories/lesson_header_factory'
import { TagFactory } from '#database/factories/tag_factory'
import Tag from '#models/tag'
import { targets } from '@adonisjs/core/logger'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const targetPool = await TagFactory.createMany(10)
    const lessonHeaders = await LessonHeaderFactory.createMany(20)

    for (const lesson of lessonHeaders) {
      const randomTags = targetPool
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((tag) => tag.id)

      await lesson.related('tags').attach(randomTags)
    }
  }
}