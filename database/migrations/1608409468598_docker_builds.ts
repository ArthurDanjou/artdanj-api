import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DockerBuilds extends BaseSchema {
  protected tableName = 'docker_builds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('builds')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
