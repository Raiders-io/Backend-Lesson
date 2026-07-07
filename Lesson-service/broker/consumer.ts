import Broker from './broker.ts'
import { CONSUMER, GROUP } from './config.ts'
import type { ApiEvent } from './event.ts'

type EventHandler = (event: ApiEvent<any>) => Promise<void>

class EventRouter {
  private handlers: Map<string, EventHandler[]> = new Map()

  on(eventType: string, handler: EventHandler) {
    const handlerList = this.handlers.get(eventType) ?? []
    handlerList.push(handler)
    this.handlers.set(eventType, handlerList)
    return this
  }

  async dispatch(event: ApiEvent<any>) {
    const handlers = this.handlers.get(event.type) ?? []
    if (handlers.length === 0) {
      console.warn(`No handlers registered for event type: ${event.type}`)
      return
    }

    await Promise.allSettled(handlers.map((handler) => handler(event)))
  }
}

export async function consume(stream: string) {
  const router = new EventRouter()

  const api = {
    on: (eventType: string, eventHandler: EventHandler) => {
      router.on(eventType, eventHandler)
      return api
    },

    start: async () => {
      const redis = await Broker.getClient()

      // Create consumer group if it doesn't exist
      try {
        await redis.xGroupCreate(stream, GROUP, '0', { MKSTREAM: true })
        console.log(`Consumer group ${GROUP} created`)
      } catch (error) {
        console.error(`Error creating consumer group ${GROUP}:`, error)
      }

      while (true) {
        // Consume messages from the stream
        const messages = await redis.xReadGroup(GROUP, CONSUMER, [{ key: stream, id: '>' }], {
          COUNT: 10,
          BLOCK: 5000,
        })

        if (!messages) {
          continue
        }

        for (const streamData of messages) {
          for (const message of streamData.messages) {
            console.log(`Received message: ${message.id} - ${JSON.stringify(message.message)}`)
            const event = {
              type: message.message.type,
              payload: JSON.parse(message.message.payload),
            }

            try {
              await router.dispatch(event)
              await redis.xAck(stream, GROUP, message.id)
            } catch (error) {
              console.error(`Error processing message ${message.id}:`, error)
            }
          }
        }
      }
    },
  }
}

// export async function consume(stream: string, handler: EventHandler) {
//   const redis = await Broker.getClient()
//   const router = new EventRouter()

//   // Create consumer group if it doesn't exist
//   try {
//     await redis.xGroupCreate(stream, GROUP, '0', { MKSTREAM: true })
//     console.log(`Consumer group ${GROUP} created`)
//   } catch (error) {
//     console.error(`Error creating consumer group ${GROUP}:`, error)
//   }

//   while (true) {
//     // Consume messages from the stream
//     const messages = await redis.xReadGroup(GROUP, CONSUMER, [{ key: stream, id: '>' }], {
//       COUNT: 10,
//       BLOCK: 5000,
//     })

//     if (!messages) {
//       continue
//     }

//     for (const streamData of messages) {
//       for (const message of streamData.messages) {
//         console.log(`Received message: ${message.id} - ${JSON.stringify(message.message)}`)

//         const event = {
//           type: message.message.type,
//           payload: JSON.parse(message.message.payload),
//         }

//         try {
//           await router.dispatch(event)
//           await redis.xAck(stream, GROUP, message.id)
//         } catch (error) {
//           console.error(`Error processing message ${message.id}:`, error)
//         }
//       }
//     }
//   }
// }
