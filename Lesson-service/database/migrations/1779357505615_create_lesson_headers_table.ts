import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_headers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.uuid('lesson_id').notNullable().unique().primary()
      table.string('slug').notNullable().unique()
      table.uuid('author_id').notNullable()
      table.boolean('is_private').notNullable().defaultTo(false) //TODO : remove defaultTo and handle it in the controller
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
