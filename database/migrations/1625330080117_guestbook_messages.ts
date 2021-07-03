import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GuestbookMessages extends BaseSchema {
  protected tableName = 'guestbook_messages'

  public async up() {
    await this.schema.table(this.tableName, async (table) => {
      await table.dropColumn('message')
      table.text('message')
    })
  }

  public async down() {
    await this.schema.table(this.tableName, (table) => {
      table.dropColumn('message')
    })
  }
}
