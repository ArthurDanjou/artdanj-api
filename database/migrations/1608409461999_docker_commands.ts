import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DockerCommands extends BaseSchema {
  protected tableName = 'docker_commands'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('commands')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
