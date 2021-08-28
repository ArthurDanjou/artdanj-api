import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostColors extends BaseSchema {
  protected tableName = 'post_colors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('color').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
