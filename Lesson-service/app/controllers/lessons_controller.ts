import type { HttpContext } from '@adonisjs/core/http'
import LessonHeader from '#models/lesson_header'
import db from '@adonisjs/lucid/services/db'

export default class LessonsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const lessons = await LessonHeader.query().preload('tags')
    return response.ok(lessons)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const { title, tags, privacy } = request.only(['title', 'tags', 'privacy'])

    if (!Array.isArray(tags) || tags.length === 0) {
      return response.badRequest({ error: 'At least one tag is required' })
    }
    // Append username when User service is ready [TODO]
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    const lessonId = await db.transaction(async (trx) => {
      const lesson = await LessonHeader.create(
        {
          title,
          slug,
          isPrivate: privacy ?? false,
          authorId: '1', // Placeholder for author ID, replace with actual user ID when User service is integrated
        },
        { client: trx }
      )

      if (tags.length > 0) {
        await lesson.related('tags').attach(tags, trx)
      }
      return lesson.lessonId
    })

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

  async showByTags({ request, response }: HttpContext) {
    const tags: string[] = request.qs().tags ? [request.qs().tags].flat() : []

    if (tags.length === 0) {
      return response.badRequest({ message: 'At least one tag is required' })
    }
    const query = LessonHeader.query().preload('tags')

    for (const tag of tags) {
      query.whereHas('tags', (tagQuery) => {
        tagQuery.where('name', tag)
      })
    }

    const lessons = await query

    if (lessons.length === 0) {
      return response.notFound({ message: 'No lessons found with the specified tags' })
    }

    return response.ok(lessons)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const lesson = await LessonHeader.findOrFail(params.id)

    const authorId = '1' // Placeholder for author ID, replace with actual user ID when User service is integrated
    if (lesson.authorId !== authorId) {
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
