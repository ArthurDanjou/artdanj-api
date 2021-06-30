import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Forms extends BaseSchema {
  protected tableName = 'forms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('email')
      table.string('subject')
      table.string('content')
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
