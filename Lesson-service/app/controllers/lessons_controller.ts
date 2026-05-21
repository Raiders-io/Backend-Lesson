import type { HttpContext } from '@adonisjs/core/http'

export default class LessonsController {
  /**
   * Display a list of resource
   */
  async index({ }: HttpContext) {
    const lessons = [
      { "id": 1, "title": "Getting started with adonis" },
      { "id": 2, "title": "Learning adonis" },
    ]
    return Response.json({ lessons })
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
  async show({ params }: HttpContext) {
    
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