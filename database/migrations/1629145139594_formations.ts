import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Formations extends BaseSchema {
  protected tableName = 'formations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
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
      table.string('location').notNullable()
      table.string('begin_date').notNullable()
      table.string('end_date').defaultTo('Today').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
