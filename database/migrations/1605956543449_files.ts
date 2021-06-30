import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Pictures extends BaseSchema {
  protected tableName = 'files'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('label').notNullable()
      table.string('file_name').notNullable()
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
