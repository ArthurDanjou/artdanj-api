import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Hash from "@ioc:Adonis/Core/Hash";

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, async (table) => {
      table.increments('id').primary()
      table.string('username', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).defaultTo(await this.randomPassword()).notNullable()
      table.boolean('is_confirmed').defaultTo(false).notNullable()
      table.string('remember_me_token').defaultTo(null).nullable()
      table.string('confirmation_token').defaultTo(null).nullable()
      table.timestamps(true, true)
    })
  }

  private async randomPassword(): Promise<string> {
    let password = ''
    const char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!.:=+-_$*^&@#%ù/àçè()é"'
    const size = 64
    for (let i = 0; i < size; i++) {
      password += char.charAt(Math.random() * char.length)
    }
    password = await Hash.make(password)
    return password
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
