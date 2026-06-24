import type { HttpContext } from '@adonisjs/core/http'
import LessonHeader from '#models/lesson_header'
import File from '#models/file'
import db from '@adonisjs/lucid/services/db'

export default class FilesController {
  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const lesson = await LessonHeader.findByOrFail('slug', request.param('id'))

    //there can be multiple files associated with a lesson, so we need to handle an array of files
    const files = request.input('files', [] as Array<{ fileId: string; filename: string }>)
    await db.transaction(async (trx) => {
      const fileRecord = files.map((file) => ({
        id: file.fileId,
        filename: file.filename,
        lessonId: lesson.id,
      }))
      await File.createMany(fileRecord, { client: trx })
    })
    return { status: 'OK', message: 'File associated with lesson successfully' }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const file = File.query()
      .where('id', params.fileId)
      .whereHas('lesson', (lessonQuery) => {
        lessonQuery.where('slug', params.id)
      })
      .first()

    if (!file) {
      return { status: 'Error', message: 'File not found for the specified lesson' }
    }
    return { status: 'OK', data: file }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const lesson = await LessonHeader.findByOrFail('slug', params.id)

    const authorId = '1' // Placeholder for author ID, replace with actual user ID when User service is integrated

    if (authorId !== lesson.authorId) {
      return { status: 'Error', message: 'Unauthorized to delete this file' }
    }

    const file = await File.query()
      .where('id', params.id)
      .where('lesson_id', lesson.id)
      .firstOrFail()

    await file.delete()

    return { status: 'deleted', messages: 'file deleted succesfully'}
  }
}