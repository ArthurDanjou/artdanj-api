import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('slug').notNullable()
      table.integer('likes').notNullable()
      table.integer('reading_time').notNullable()
      table.string('date').notNullable()
      table
        .integer('title_id')
        .unsigned()
        .references('translations.id')
        .onDelete('CASCADE')
      table
        .integer('description_id')
        .unsigned()
        .references('translations.id')
        .onDelete('CASCADE')
      table
        .integer('cover_id')
        .unsigned()
        .references('files.id')
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
