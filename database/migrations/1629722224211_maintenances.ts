import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Maintenances extends BaseSchema {
  protected tableName = 'maintenances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('active').defaultTo(false).notNullable()
      table
        .integer('reason_id')
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
