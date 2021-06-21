import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subscribers extends BaseSchema {
  protected tableName = 'subscribers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
