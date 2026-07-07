import { createClient } from 'redis'
import type { RedisClientType } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

class Broker {
  private client?: RedisClientType

  async connect() {
    if (this.client) {
      return
    }

    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    })

    this.client.on('error', (err) => console.error('Redis Client Error', err))

    await this.client.connect()
    console.log('Connected to Redis broker')
  }

  async getClient(): Promise<RedisClientType> {
    if (!this.client) {
      await this.connect()
    }
    return this.client as RedisClientType
  }

  async disconnect() {
    await this.client?.quit()
    this.client = undefined
  }
}

export default new Broker()
