import type { ApplicationService } from '@adonisjs/core/types'
import { Broker, consume } from '@yosone/broker'
import LessonOperations from '#service/lesson'

export default class BrokerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

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
    Broker.init({
      group: 'lesosn-service',
      consumer: 'lesson-consumer',
      redisUrl: 'redis://redis:6379',
      logLevel: 4,
    })

    consume('auth.service')
      .on('auth.user.deleted', async (event) => {
        const authorId: string = event.payload.userId
        if (authorId) await LessonOperations.deleteLessonsByAuthor(authorId)
      })
      .on('auth.user.updated', () => {})
      .start()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    await Broker.disconnect()
  }
}
