import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_headers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.text('description').nullable()
      table.string('title').notNullable()
      table.uuid('lesson_id').notNullable().unique().primary()
      table.string('slug').notNullable()
      table.uuid('author_id').references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.boolean('is_private').notNullable().defaultTo(false) //TODO : remove defaultTo and handle it in the controller
      // A slug only needs to be unique per author. The constraint also closes
      // the race between the collision check and the insert.
      table.unique(['author_id', 'slug'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.float('pertinence').notNullable().defaultTo(0) //TODO : remove defaultTo and handle it in the controller
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
