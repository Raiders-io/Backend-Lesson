import db from '@adonisjs/lucid/services/db'
import { publish } from '@yosone/broker'
import { STREAM_NAME, PublishOpt } from '#utils/types'
import LessonFile from '#models/lesson_file'
import LessonOperations from '#service/lesson'
import EventGenerator from '#service/event'

class FileOperation {
  async attach(filenames: string[], lessonId: string) {
    const lesson = await LessonOperations.getLessonById(lessonId)
    if (!lesson) return

    const payload = filenames.map((filename) => ({
      filename,
      lessonId,
    }))

    const record = await db.transaction(async (trx) => {
      return await LessonFile.createMany(payload, { client: trx })
    })

    const event = EventGenerator.fileAttached(filenames, lessonId, lesson.authorId)
    publish(STREAM_NAME, event, PublishOpt)
    return record
  }

  async detach(filenames: string[], lessonId: string) {
    const lesson = await LessonOperations.getLessonById(lessonId)
    if (!lesson) return

    await LessonFile.query().whereIn('filename', filenames).where('lesson_id', lessonId).delete()

    const event = EventGenerator.fileDetached(filenames, lessonId, lesson.authorId)
    publish(STREAM_NAME, event, PublishOpt)
  }

  async delete(filename: string, userId: string) {
    const matches = await LessonFile.query()
      .where('filename', filename)
      .whereHas('LessonHeader', (query) => {
        query.where('author_id', userId)
      })
      .delete()
      .returning('lesson_id')

    if (!matches || matches.length === 0) return
    const lessonIds = matches.map((match) => match.lessonId)

    const event = EventGenerator.fileDeleted(filename, lessonIds, userId)
    publish(STREAM_NAME, event, PublishOpt)
  }

  async getByLessonId(lessonId: string) {
    const files = await LessonFile.query().where('lesson_id', lessonId)
    return files
  }

  async getByFile(filename: string) {
    return await LessonFile.query().where('filename', filename)
  }

  async getByLessonIdAndFile(filename: string, lessonId: string) {
    return await LessonFile.query()
      .where('filename', filename)
      .andWhere('lesson_id', lessonId)
      .first()
  }

  async getRelatedLesson(filename: string) {
    const files = await LessonFile.query().where('filename', filename)
    const ids = Array.from(files, (file) => file.lessonId)
    return await LessonOperations.getLessonsByIds(ids)
  }
}

export default new FileOperation()
