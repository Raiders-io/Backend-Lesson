import type { ApplicationService } from '@adonisjs/core/types'
import { Broker, consume, publish } from '@yosone/broker'
import LessonOperations from '#service/lesson'

export default class BrokerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    Broker.init({
      group: 'lesosn-service',
      consumer: 'lesson-consumer',
      redisUrl: process.env.REDIS_URL || 'redis://redis:6380',
      logLevel: 4,
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    consume('auth.service')
      .on('auth.user.deleted', async (event) => {
        const authorId: string = event.payload.userId
        if (authorId) await LessonOperations.deleteLessonsByAuthorId(authorId)
      })
      .on('auth.user.updated', () => {})
      .start()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    Broker.disconnect()
  }
}
