import { HttpResponse, ResponseStatus, type HttpContext } from '@adonisjs/core/http'
import FileOperation from '#service/file'
import LessonOperations from '#service/lesson'
import { RESP_TYPES } from 'redis'
import { STATUS_CODES } from 'node:http'

export default class FilesController {
  async index({ params, response }: HttpContext) {
    const lessonId = params.id

    const files = await FileOperation.getByLessonId(lessonId)
    if (!files || files.length === 0) return response.notFound('No files found for this lesson')

    return files
  }
  /**
   * Handle form submission for the create action
   */
  //I need to check if the user own the file and the lesson before attaching the file to the lesson
  //Need to ask to file service to check if the user own the file.
  async store({ params, request, response }: HttpContext) {
    const lessonId = params.id
    const files: string[] = request.input('files')
    const userId = request.ctx?.userId ?? ''

    const lesson = await LessonOperations.getLessonById(lessonId)
    if (!lesson) return response.notFound('Failed to find corresponding lesson')
    if (lesson.authorId !== userId)
      return response.forbidden('You are not allowed to modify this lesson')
    if (!files || files.length === 0) return response.badRequest('No files provided')

    const res = await fetch(`${process.env.FILE_SERVICE_URL}/api/v1/files/attach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${request.header('authorization')}`,
      },
      body: JSON.stringify({
        files: files,
        userId: userId,
      }),
    })
    if (res.status === ResponseStatus.Forbidden)
      return response.badRequest('You must own the file you are trying to attach')
    if (res.status !== ResponseStatus.Accepted)
      return response.internalServerError('Failed to verify files ownership')


  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
