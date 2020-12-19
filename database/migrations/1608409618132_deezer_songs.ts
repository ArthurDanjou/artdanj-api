import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DeezerSongs extends BaseSchema {
  protected tableName = 'deezer_songs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('author')
      table.string('title')
      table.string('album')
      table.string('type')
      table.string('device')
      table.integer('duration')
      table.date('release_date')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
