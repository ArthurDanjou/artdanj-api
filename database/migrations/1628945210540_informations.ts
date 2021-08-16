import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Informations extends BaseSchema {
  protected tableName = 'informations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('age').notNullable()
      table
        .integer('translation_id')
        .unsigned()
        .references('translations.id')
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
