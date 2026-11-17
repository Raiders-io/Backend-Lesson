import db from '@adonisjs/lucid/services/db'
import { publish } from '@yosone/broker'
import { STREAM_NAME, PublishOpt } from '#utils/types'
import LessonFile from '#models/lesson_file'
import LessonOperations from '#service/lesson'
import EventGenerator from '#service/event'

class FileOperation {
  async attach(filenames: string[], lessonId: string, userId: string) {
    const lesson = await LessonOperations.getLessonById(lessonId, userId)
    if (!lesson) return

    const payload = filenames.map((filename) => ({
      filename,
      lessonId,
    }))

    const record = await db.transaction(async (trx) => {
      return await LessonFile.createMany(payload, { client: trx })
    })

    try {
      const event = EventGenerator.fileAttached(filenames, lessonId, lesson.authorId)
      publish(STREAM_NAME, event, PublishOpt)
    } catch (error) {
      console.error('Error occurred while publishing file attachment:', error)
    }
    return record
  }

  async detach(filenames: string[], lessonId: string, userId: string) {
    const lesson = await LessonOperations.getLessonById(lessonId, userId)
    if (!lesson) return

    await LessonFile.query().whereIn('filename', filenames).where('lesson_id', lessonId).delete()

    try {
      const event = EventGenerator.fileDetached(filenames, lessonId, lesson.authorId)
      publish(STREAM_NAME, event, PublishOpt)
    } catch (error) {
      console.error('Error occurred while publishing file detachment:', error)
    }
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
    // Write queries bypass Lucid's model hydration and return raw driver rows,
    // so the column is exposed using its snake_case database name.
    const lessonIds = matches.map((match) => match.lesson_id)

    try {
      const event = EventGenerator.fileDeleted(filename, lessonIds, userId)
      publish(STREAM_NAME, event, PublishOpt)
    } catch (error) {
      console.error('Error occurred while publishing file deletion:', error)
    }
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

  async getRelatedLesson(filename: string, userId?: string) {
    const files = await LessonFile.query().where('filename', filename)
    const ids = Array.from(files, (file) => file.lessonId)
    return await LessonOperations.getLessonsByIds(ids, userId)
  }
}

export default new FileOperation()
