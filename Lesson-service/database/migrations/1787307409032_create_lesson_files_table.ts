import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('file_id').notNullable()
      table
        .uuid('lesson_id')
        .notNullable()
        .references('lesson_id')
        .inTable('lesson_headers')
        .onDelete('CASCADE')

      table.primary(['file_id', 'lesson_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
