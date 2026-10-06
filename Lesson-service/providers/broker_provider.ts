import type { ApplicationService } from '@adonisjs/core/types'
import { Broker, consume } from '@yosone/broker'
import LessonOperations from '#service/lesson'
import { LOGLEVEL } from '@yosone/broker'
import env from '#start/env'

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
      group: env.get('CONSUMER_GROUP'),
      consumer: env.get('CONSUMER_NAME'),
      redisUrl: env.get('REDIS_HOST') + ':' + env.get('REDIS_PORT'),
      logLevel: Number.parseInt(env.get('LOGLEVEL')),
    })

    const authConsumer = consume('auth.events')

    authConsumer.on('auth.user.deleted', async (event) => {
      const authorId: string = event.payload.userId
      if (authorId) await LessonOperations.deleteLessonsByAuthor(authorId)
    })

    authConsumer.on('auth.user.updated', async (event) => {
      console.log('auth.user.updated event received', event)
    })

    authConsumer.start()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    await Broker.disconnect()
  }
}
