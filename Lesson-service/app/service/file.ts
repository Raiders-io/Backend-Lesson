import db from '@adonisjs/lucid/services/db'
import type File from '#models/lesson_file'
import { publish } from '@yosone/broker'
import type { PublishOptions } from '@yosone/broker'
import { STREAM_NAME } from '#types'
import LessonFile from '#models/lesson_file'
import LessonOperations from '#service/lesson'

const PublishOpt: PublishOptions = {
  retry: 3,
  retryTime: 1000,
}

class FileOperation {
  async attach(fileModel: File, lessonId: string) {
    await db.transaction(async (trx) => {
      fileModel.useTransaction(trx)
      fileModel.lessonId = lessonId
      await fileModel.save()
    })
    publish(STREAM_NAME, {
      type: 'file.attached',
      payload: {
        fileId: fileModel.fileId,
        lessonId: fileModel.lessonId,
      },
    })
  }

  async detach(fileId: string, lessonId: string) {
    await LessonFile.query().where({ file_id: fileId, lesson_id: lessonId }).delete()

    publish(STREAM_NAME, {
      type: 'file.detached',
      payload: {
        fileId: fileId,
        lessonId: lessonId,
      },
    })
  }

  async delete(fileId: string) {
    const files = await LessonFile.query().where('fileId', fileId)
    const lessonIds = Array.from(files, (file) => file.lessonId)
    await LessonFile.query().where('fileId', fileId).delete()

    publish(
      STREAM_NAME,
      {
        type: 'file.deleted',
        payload: {
          fileId: fileId,
          lessonId: lessonIds,
        },
      },
      PublishOpt
    )
  }

  async getByLessonId(lessonId: string) {
    const files = await LessonFile.query().where('lesson_id', lessonId)
    return files
  }

  async getByFileId(fileId: string) {
    return await LessonFile.query().where('file_id', fileId)
  }

  async getRelatedLesson(fileId: string) {
    const files = await LessonFile.query().where('file_id', fileId)
    const ids = Array.from(files, (file) => file.lessonId)
    return await LessonOperations.getLessonsByIds(ids)
  }
}

export default new FileOperation()
