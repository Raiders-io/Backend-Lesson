import { type HttpRequest, ResponseStatus, type HttpContext } from '@adonisjs/core/http'
import FileOperation from '#service/file'
import LessonOperations from '#service/lesson'
import { fileDataValidator, fileOwnershipValidator } from '#validators/file_ownership'
import File from '#models/lesson_file'
const verifyRouteURL = '/api/v1/storage/objects/search'

export const ErrorMessage = {
  User: {
    Logout: 'You must be log in',
    IdMatching: 'You are not allowed to modify this lesson',
  },
  File: {
    RelatedLesson: 'Failed to find related lesson',
    Ownership: 'You do not own any of the provided files',
    OwnershipError: 'Failed to verify ownership',
    NotFound: 'File not found',
    NoFile: 'No files provided',
    FailedVerif: 'Failed to verify file ownership',
  },
} as const

async function verifyFilesOwnership(files: string[], userId: string, request: HttpRequest) {
  const res = await fetch(`${process.env.FILE_SERVICE_URL}${verifyRouteURL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${request.header('authorization', '')}`,
    },
    body: JSON.stringify({
      files: files,
      userId: userId,
    }),
  })
  if (res && res.status === ResponseStatus.Ok) {
    try {
      const data = await res.json()
      return await fileOwnershipValidator.validate(data)
    } catch (error) {
      console.error('Error parsing JSON response:', error)
      return null
    }
  } else return null
}

export default class FilesController {
  async index({ params, response }: HttpContext) {
    const lessonId = params.id

    const files = await FileOperation.getByLessonId(lessonId)
    if (!files || files.length === 0) return response.notFound(`${ErrorMessage.File.NotFound}`)

    return files
  }

  /**
   * Handle form submission for the create action
   */
  async store({ params, request, response }: HttpContext) {
    const lessonId = params.id
    const { files } = await request.validateUsing(fileDataValidator)
    const userId = request.ctx?.userId ?? ''

    const lesson = await LessonOperations.getLessonById(lessonId)
    if (!lesson) return response.notFound(`${ErrorMessage.File.RelatedLesson}`)
    if (lesson.authorId !== userId) return response.forbidden(`${ErrorMessage.User.IdMatching}`)
    if (!files || files.length === 0) return response.badRequest(`${ErrorMessage.File.NoFile}`)

    const ownership = await verifyFilesOwnership(files, userId, request)
    if (!ownership) return response.internalServerError(`${ErrorMessage.File.OwnershipError}`)

    if (ownership.found.length === 0) return response.forbidden(`${ErrorMessage.File.Ownership}`)

    return await FileOperation.attach(ownership.found, lessonId)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const [lessonId, filename] = [params.id, params.file]

    const file = await FileOperation.getByLessonIdAndFile(filename, lessonId)
    if (!file) return response.notFound(`${ErrorMessage.File.NotFound}`)

    return file
  }

  async showLessons({ params, response }: HttpContext) {
    const filename = params.file

    const lessons = await FileOperation.getRelatedLesson(filename)
    if (!lessons || lessons.length === 0)
      return response.notFound(`${ErrorMessage.File.RelatedLesson}`)
    return lessons
  }
  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const lessonId = params.id
    const userId = request.ctx?.userId

    if (!userId) return response.forbidden('You must be log in')
    const lesson = await LessonOperations.getLessonById(lessonId)
    if (!lesson) return response.notFound('Cannot find related lesson')
    if (lesson.authorId !== userId)
      return response.forbidden('You must own the lesson to update the files')
  }

  /**
   * Delete record
   */
  //Maybe remove the ownership of file check since you can only delete files from your own lesson
  async destroy({ request, params, response }: HttpContext) {
    const lessonId = params.id
    const { files } = await request.validateUsing(fileDataValidator)
    const userId = request.ctx?.userId ?? ''

    const lesson = await LessonOperations.getLessonById(lessonId)
    if (!lesson) return response.notFound(`${ErrorMessage.File.RelatedLesson}`)
    if (lesson.authorId !== userId) return response.forbidden(`${ErrorMessage.User.IdMatching}`)
    if (!files || files.length === 0) return response.badRequest(`${ErrorMessage.File.NoFile}`)

    const ownership = await verifyFilesOwnership(files, userId, request)
    if (!ownership) return response.internalServerError(`${ErrorMessage.File.OwnershipError}`)

    if (ownership.found.length === 0) return response.forbidden(`${ErrorMessage.File.Ownership}`)

    return await FileOperation.detach(ownership.found, lessonId)
  }

  /*
   * Delete record by file name
   */
  async destroyByFile({ params, request, response }: HttpContext) {
    const filename = params.file
    const userId = request.ctx?.userId ?? ''

    const ownership = await verifyFilesOwnership([filename], userId, request)
    if (!ownership) return response.internalServerError(`${ErrorMessage.File.OwnershipError}`)

    if (ownership.found.length === 0) return response.forbidden(`${ErrorMessage.File.Ownership}`)

    return await FileOperation.delete(ownership.found[0], userId)
  }
}
