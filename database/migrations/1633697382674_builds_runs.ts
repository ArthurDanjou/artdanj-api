import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BuildsRuns extends BaseSchema {
  protected tableName = 'builds_runs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.bigInteger('builds')
      table.timestamp('date')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
