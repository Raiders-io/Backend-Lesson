import type { HttpContext } from '@adonisjs/core/http'
import LessonHeader from '#models/lesson_header'
import db from '@adonisjs/lucid/services/db'
import Tag from '#models/tag'
import LessonOperations from '#service/lesson'

export async function storeLesson(lessonModel: LessonHeader, tags: number[]) {
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

export async function deleteLesson(lessonId?: string, authorId?: string) {
  if (authorId) {
    await LessonHeader.query().where('authorId', authorId).delete()
  } else if (lessonId) {
    await LessonHeader.query().where('lessonId', lessonId).delete()
  }
}

export default class LessonsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const lessons = await LessonHeader.query().preload('tags').where('isPrivate', false)
    return response.ok(lessons)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { title, tags, privacy } = request.only(['title', 'tags', 'privacy'])

    const userId = request.ctx?.userId

    if (!userId) return response.unauthorized({ error: 'Unauthorized to create a lesson' })

    if (!Array.isArray(tags) || tags.length === 0) {
      return response.badRequest({ error: 'At least one tag is required' })
    }
    // Append username when User service is ready [TODO]
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const lessonModel = new LessonHeader()
    const tagsId = await Tag.query().whereIn('name', tags).select('id')

    lessonModel.title = title
    lessonModel.slug = slug
    lessonModel.isPrivate = privacy ?? false
    lessonModel.authorId = userId

    const lessonId = await LessonOperations.storeLesson(
      lessonModel,
      Array.from(tagsId, (tag) => tag.id)
    )

    return response.created({ lessonId })
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const lesson = await LessonHeader.query()
      .where('slug', params.id)
      .preload('tags')
      .preload('files')
      .firstOrFail()

    return response.ok(lesson)
  }

  /**
   *  Return the list of all tags avaible in the database. This endpoint is used to populate the tag selection in the frontend.
   */
  async showTags({ response }: HttpContext) {
    const tags = await Tag.all()

    response.header('cache-control', 'public, max-age=3600') // Cache the response for 1 hour
    return response.ok(tags)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const lesson = await LessonHeader.findOrFail(params.id)

    const authorId = request.ctx?.userId
    if (!authorId || lesson.authorId !== authorId) {
      return response.forbidden({ error: 'Unauthorized to update this lesson' })
    }

    const { title, tags, privacy } = request.only(['title', 'tags', 'privacy'])
    if (title) {
      lesson.title = title
      lesson.slug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    }

    if (tags && (!Array.isArray(tags) || tags.length === 0)) {
      return response.badRequest({ error: 'At least one tag is required' })
    }

    lesson.isPrivate = privacy ?? lesson.isPrivate
    await db.transaction(async (trx) => {
      lesson.useTransaction(trx)
      await lesson.save()
      await lesson.related('tags').sync(tags)
    })
    return response.ok({ message: 'Lesson updated successfully' })
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const lesson = await LessonHeader.findOrFail(params.id)

    const authorId = '1' // Placeholder for author ID, replace with actual user ID when User service is integrated
    if (lesson.authorId !== authorId) {
      return response.badRequest({ error: 'Unauthorized to delete this lesson' })
    }

    await lesson.delete()
    return response.ok({ message: 'Lesson deleted successfully' })
  }
}
