import { readFile } from 'node:fs/promises'
import Tag from '#models/tag'
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const filePath = app.makePath(env.get('TAG_FILE'))
    const content = await readFile(filePath, 'utf8')

    const uniqueNames = Array.from(
      new Set(
        content
          .split(/\r?\n/)
          .map((name) => name.trim())
          .filter(Boolean)
      )
    )

    const payload = uniqueNames.map((name) => ({ name }))
    await Tag.fetchOrCreateMany('name', payload)
  }
}
