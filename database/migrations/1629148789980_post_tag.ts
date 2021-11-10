import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostTags extends BaseSchema {
  protected tableName = 'post_tag'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('post_id')
        .unsigned()
        .references('posts.id')
        .onDelete('CASCADE')
      table
        .integer('tag_id')
        .unsigned()
        .references('tags.id')
        .onDelete('CASCADE')
      table.unique(['post_id', 'tag_id'])
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
