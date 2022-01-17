import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SpotifySongsHistory extends BaseSchema {
  protected tableName = 'spotify_songs_history'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.timestamp('date').primary().unique().defaultTo(this.now())
      table.string('device_name').notNullable()
      table.string('device_type').notNullable()
      table.string('item_id').notNullable()
      table.string('item_name').notNullable()
      table.string('item_type').notNullable()
      table.string('author').notNullable()
      table.string('image').notNullable()
      table.bigInteger('duration').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
