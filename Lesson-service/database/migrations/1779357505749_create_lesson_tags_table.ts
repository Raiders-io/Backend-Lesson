import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid('lesson_id')
        .notNullable()
        .references('lesson_id')
        .inTable('lesson_headers')
        .onDelete('CASCADE')

      table
        .integer('tag_id')
        .notNullable()
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE')

      table.primary(['lesson_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}