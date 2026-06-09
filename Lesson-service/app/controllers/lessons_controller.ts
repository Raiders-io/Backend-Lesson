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
    const { title, tags } = request.only(['title', 'tags'])

    if (!Array.isArray(tags) || tags.length === 0) {
      return response.badRequest({ error: 'At least one tag is required' })
    }
    // Append username when User service is ready [TODO]
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    const lessonId = await db.transaction(async (trx) => {
      const lesson = await LessonHeader.create({ title, slug }, { client: trx })
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
    const lesson = await LessonHeader.query().where('slug', params.id).preload('tags').firstOrFail()

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
  async update({ params, request }: HttpContext) { }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) { }
}