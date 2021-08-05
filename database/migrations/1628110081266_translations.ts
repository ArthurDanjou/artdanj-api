import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Translations extends BaseSchema {
  protected tableName = 'translation'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').notNullable()
      table.string('french').defaultTo('Traduction manquante')
      table.string('code').defaultTo('Missing translation')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
