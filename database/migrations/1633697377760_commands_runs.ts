import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CommandsRuns extends BaseSchema {
  protected tableName = 'commands_runs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.bigInteger('commands')
      table.date('date')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
