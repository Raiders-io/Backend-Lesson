import type { HttpContext } from '@adonisjs/core/http'
import LessonHeader from '#models/lesson_header'

export default class LessonsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const lessons = await LessonHeader.query().preload('tags') 
    return response.ok(lessons)
  }

  /**
   * Display form to create a new record
   */
  async create({ }: HttpContext) { }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) { }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const lesson = await LessonHeader.query()
      .where('slug', params.id)
      .preload('tags')
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
   * Edit individual record
   */
  async edit({ params }: HttpContext) { }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) { }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) { }
}