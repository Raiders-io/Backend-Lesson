import Broker from './broker.ts'
import type { ApiEvent } from './event.ts'

export async function publish<T>(stream: string, event: ApiEvent<T>) {
  const redis = await Broker.getClient()

  await redis.xAdd(stream, '*', {
    type: event.type,
    payload: JSON.stringify(event.payload),
  })

  console.log(`Published ${event.type}`)
}
