import type { HttpContext } from '@adonisjs/core/http'
import LessonHeader from '#models/lesson_header'
import Tag from '#models/tag'
import LessonOperations from '#service/lesson'
import { getUsername } from '#middleware/verify_token_middleware'
import type { UserInfo, LessonDataInterface } from '#utils/types'
import { ErrorMessage } from '#utils/message'

export default class LessonsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const lessons = await LessonHeader.query().preload('tags').where('isPrivate', false)
    return response.ok(lessons)
  }

  /**
   * Show individual record
   */
  async showByContent({ params, response }: HttpContext) {
    const lesson = await LessonOperations.getLessonByAuthorAndContent(params.author, params.content)
    if (!lesson) {
      return response.notFound(ErrorMessage.Lessons.NotFound)
    }
    return response.ok(lesson)
  }

  /**
   * Show lessons by author
   *
   */
  async showByAuthor({ params, response }: HttpContext) {
    const authorId = params.author

    const lessons = await LessonOperations.getLessonByAuthor(authorId)

    if (!lessons || lessons.length === 0) {
      return response.notFound(ErrorMessage.Lessons.NotFoundAuthor)
    }
    return response.ok(lessons)
  }

  /**
   *  Return the list of all tags avaible in the database. This endpoint is used to populate the tag selection in the frontend.
   */
  async showTags({ response }: HttpContext) {
    const tags = await Tag.all()

    // response.header('cache-control', 'public, max-age=3600') // Cache the response for 1 hour
    return response.ok(tags)
  }

  /**
   * Show individual record by ID
   */
  async showById({ params, response }: HttpContext) {
    const lesson = await LessonOperations.getLessonById(params.id)
    console.log('params.id', params.id)
    if (!lesson) {
      return response.notFound(ErrorMessage.Lessons.NotFound)
    }
    return response.ok(lesson)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const lessonDataInterface: LessonDataInterface = request.only([
      'title',
      'description',
      'tags',
      'privacy',
    ])

    const userId: string = request.ctx?.userId ?? ''
    const userInfo: UserInfo | null = await getUsername(
      request.header('authorization')?.replace('Bearer ', '') ?? ''
    )

    if (!userId) return response.unauthorized(ErrorMessage.User.Logout)

    if (!userInfo) return response.internalServerError(ErrorMessage.User.Fetch)

    if (!lessonDataInterface.title) {
      return response.badRequest({ error: ErrorMessage.Lessons.NoTitle })
    }

    if (!Array.isArray(lessonDataInterface.tags) || lessonDataInterface.tags.length === 0) {
      return response.badRequest(ErrorMessage.Lessons.NoTags)
    }

    const slug = lessonDataInterface.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const lessonModel = new LessonHeader()

    const query = await LessonHeader.query()
      .where('author', userInfo.username)
      .where('slug', slug)
      .first()
    if (query) {
      return response.conflict(ErrorMessage.Lessons.Collision)
    }

    lessonModel.title = lessonDataInterface.title
    lessonModel.slug = slug
    lessonModel.isPrivate = lessonDataInterface.privacy ?? false
    lessonModel.author = userInfo.username
    lessonModel.authorId = userInfo.id
    lessonModel.description = lessonDataInterface.description ?? ''

    let lessonId: string
    lessonId = await LessonOperations.storeLesson(lessonModel, lessonDataInterface.tags)

    return response.created({ lessonId })
  }

  /**
   * Handle form submission for the edit action by author/content
   */
  async updateByContent({ params, request, response }: HttpContext) {
    const lesson = await LessonHeader.query()
      .where('author', params.author)
      .where('slug', params.content)
      .first()
    if (!lesson) {
      return response.notFound(ErrorMessage.Lessons.NotFound)
    }

    const authorId = request.ctx?.userId
    if (!authorId) return response.unauthorized(ErrorMessage.User.Logout)
    if (lesson.authorId !== authorId) return response.forbidden(ErrorMessage.Lessons.NotAllowed)

    const lessonDataInterface = request.only(['title', 'tags', 'description', 'privacy'])
    try {
      await LessonOperations.updateLesson(lesson, lessonDataInterface)
    } catch (error) {
      return response.badRequest(
        error instanceof Error ? { error: error.message } : { error: 'Failed to update lesson' }
      )
    }
    return response.ok(ErrorMessage.Lessons.Ok)
  }
  /**
   * Handle form submission for the edit action
   */
  async updateById({ params, request, response }: HttpContext) {
    const lesson = await LessonHeader.findOrFail(params.id)

    const authorId = request.ctx?.userId
    if (!authorId) return response.unauthorized(ErrorMessage.User.Logout)
    if (lesson.authorId !== authorId) return response.forbidden(ErrorMessage.Lessons.NotAllowed)

    const lessonUpdateData: LessonDataInterface = request.only([
      'title',
      'tags',
      'privacy',
      'description',
    ])

    lesson.load('tags')
    try {
      await LessonOperations.updateLesson(lesson, lessonUpdateData)
    } catch (error) {
      return response.badRequest(
        error instanceof Error ? { error: error.message } : { error: 'Failed to update lesson' }
      )
    }
    return response.ok(ErrorMessage.Lessons.Ok)
  }

  /**
   * Delete record
   */
  async destroyById({ request, params, response }: HttpContext) {
    const lesson = await LessonHeader.findOrFail(params.id)

    const authorId = request.ctx?.userId
    if (!authorId) return response.unauthorized(ErrorMessage.User.Logout)
    if (lesson.authorId !== authorId) return response.forbidden(ErrorMessage.Lessons.NotAllowed)

    await LessonOperations.deleteLessonById(lesson.lessonId)
    return response.ok(ErrorMessage.Lessons.Ok)
  }

  async destroyByContent({ request, params, response }: HttpContext) {
    const lesson = await LessonHeader.query()
      .where('author', params.author)
      .where('content', params.content)
      .first()
    if (!lesson) {
      return response.notFound(ErrorMessage.Lessons.NotFound)
    }

    const authorId = request.ctx?.userId
    if (!authorId) return response.unauthorized(ErrorMessage.User.Logout)
    if (lesson.authorId !== authorId) return response.forbidden(ErrorMessage.Lessons.NotAllowed)

    await LessonOperations.deleteLessonById(lesson.lessonId)
    return response.ok(ErrorMessage.Lessons.Ok)
  }
}
