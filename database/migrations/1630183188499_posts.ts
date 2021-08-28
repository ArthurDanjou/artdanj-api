import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table
        .integer('content_id')
        .unsigned()
        .references('translations.id')
        .onDelete('CASCADE')
      table
        .integer('color_id')
        .unsigned()
        .references('post_colors.id')
        .onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('content_id', 'color_id')
    })
  }
}
