import type { HttpContext } from '@adonisjs/core/http'
import LessonHeader from '#models/lesson_header'

export default class SearchesController {
  async index({ request }: HttpContext) {
    const title = request.input('title', '') || request.input('name', '')
    const tags: string[] = request.input('tags') ? [request.input('tags')].flat() : []

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const query = LessonHeader.query().preload('tags')

    query.where('is_private', false) // Only search public lessons

    //TODO : Handle private lessons when User service is ready, by checking the user ID and allowing access to their own private lessons
    if (title) {
      query.where('title', 'ILIKE', `%${title}%`)
    }

    if (tags && Array.isArray(tags) && tags.length > 0) {
      query.whereHas('tags', (tagQuery) => {
        tagQuery.whereIn('name', tags)
      })
    }

    const rawSort = request.input('sortBy', 'created_at')
    const allowedSortFields: Record<string, string> = {
      created_at: 'created_at',
      updated_at: 'updated_at',
      title: 'title',
      name: 'title',
      pertinence: 'pertinence',
    }

    const sortBy = allowedSortFields[rawSort] || 'created_at'
    const direction = request.input('direction', 'desc') === 'asc' ? 'asc' : 'desc'

    query.orderBy(sortBy, direction)
    const lessons = await query.paginate(page, limit)

    return lessons.toJSON()
  }
}
