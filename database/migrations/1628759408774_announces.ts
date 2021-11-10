import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Announces extends BaseSchema {
  protected tableName = 'announces'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('color').notNullable()
      table.string('hover_color')
      table
        .integer('message_id')
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
