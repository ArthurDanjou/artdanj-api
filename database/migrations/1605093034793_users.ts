import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable()
      table.string('password', 180).defaultTo(this.randomPassword()).notNullable()
      table.boolean('is_confirmed').defaultTo(false).notNullable()
      table.string('remember_me_token').defaultTo(null).nullable()
      table.string('confirmation_token').defaultTo(null).nullable()
      table.timestamps(true)
    })
  }

  private randomPassword () {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = ''
    let passwordLength = 12

    for (let i = 0; i < passwordLength; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      password += chars.substring(rnum,rnum+1);
    }

    return password
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
