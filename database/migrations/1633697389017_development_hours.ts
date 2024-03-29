import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DevelopmentHours extends BaseSchema {
  protected tableName = 'development_hours'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.double('seconds')
      table.string('date')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
