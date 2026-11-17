import type { ApplicationService } from '@adonisjs/core/types'
import { Broker, consume, LOGLEVEL, publish } from '@yosone/broker'
import LessonOperations from '#service/lesson'
import env from '#start/env'
import { STREAM_NAME } from '#utils/types'
import User from '#models/user'
import { usernameUpdatedValidator } from '#validators/user'

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
      logLevel: LOGLEVEL.ERROR,
    })

    publish(STREAM_NAME, {
      type: 'lesson.started',
      payload: {
        status: 'Ok',
      },
    })

    const authConsumer = consume('auth.events')
    const userConsumer = consume('user.events')

    authConsumer.on('auth.user.deleted', async (event: any) => {
      const authorId: string = event.payload.userId
      if (authorId) await LessonOperations.deleteLessonsByAuthor(authorId)
    })

    authConsumer.on('auth.user.updated', async (event: any) => {
      console.log('auth.user.updated event received', event)
    })

    userConsumer.on('username.updated', async (event: any) => {
      try {
        const payload = await usernameUpdatedValidator.validate(event.payload)
        const user = await User.findBy('id', payload.userId)

        if (!user) {
          console.warn(`username.updated: user ${payload.userId} not found`)
          return
        }

        user.username = payload.username
        await user.save()
      } catch (error) {
        console.error('Error handling username.updated event:', error)
      }
    })

    authConsumer.start()
    userConsumer.start()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    await Broker.shutdown()
  }
}
