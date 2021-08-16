import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Experiences extends BaseSchema {
  protected tableName = 'experiences'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('title_id')
        .unsigned()
        .references('translations.id')
        .onDelete('CASCADE')
      table.string('company').notNullable()
      table.string('location').notNullable()
      table.string('begin_date').notNullable()
      table.string('end_date').defaultTo('Today').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
