import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Translations extends BaseSchema {
  protected tableName = 'translations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('code').notNullable()
      table.string('french').defaultTo('Traduction manquante')
      table.string('english').defaultTo('Missing translation')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
