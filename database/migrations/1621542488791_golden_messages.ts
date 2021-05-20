import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GoldenMessages extends BaseSchema {
  protected tableName = 'golden_messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.string('message')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
