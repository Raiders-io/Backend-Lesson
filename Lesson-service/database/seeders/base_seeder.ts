import { LessonHeaderFactory } from '#database/factories/lesson_header_factory'
import { TagFactory } from '#database/factories/tag_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const TargetPool = await TagFactory.createMany(10)
    await LessonHeaderFactory.with('tags', 3, (relation) => {
      relation.merge(TargetPool)
    }).createMany(20)
  }
}