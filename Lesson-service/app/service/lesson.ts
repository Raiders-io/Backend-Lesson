import LessonHeader from '#models/lesson_header'
import db from '@adonisjs/lucid/services/db'

export class LessonOperations {
  async storeLesson(lessonModel: LessonHeader, tags: number[]) {
    const lessonId = await db.transaction(async (trx) => {
      lessonModel.useTransaction(trx)
      await lessonModel.save()
      if (tags.length > 0) {
        await lessonModel.related('tags').attach(tags, trx)
      }
      return lessonModel.lessonId
    })
    return lessonId
  }

  /**
   *  Delete a lesson by its ID,
   *  If authorId is provided it will delete all lesson from this author.
   */

  async deleteLesson(lessonId?: string, authorId?: string) {
    if (authorId) {
      await LessonHeader.query().where('authorId', authorId).delete()
    } else if (lessonId) {
      await LessonHeader.query().where('lessonId', lessonId).delete()
    }
  }
}

export default new LessonOperations()
