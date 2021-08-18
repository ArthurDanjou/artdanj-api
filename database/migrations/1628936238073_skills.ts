import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Skills extends BaseSchema {
  protected tableName = 'skills'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('color').notNullable()
      table
        .integer('file_id')
        .unsigned()
        .references('files.id')
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
