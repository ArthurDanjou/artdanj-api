import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('cover_id').unsigned().references('files.id').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('cover_id')
    })
  }
}
