import {DateTime} from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {BaseModel, beforeSave, column, hasOne, HasOne,} from '@ioc:Adonis/Lucid/Orm'
import GuestbookMessage from "App/Models/GuestbookMessage";

export default class User extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public confirmationToken: string

  @column()
  public isConfirmed: boolean

  @column()
  public rememberMeToken?: string

  @hasOne(() => GuestbookMessage)
  public guestbook_message: HasOne<typeof GuestbookMessage>

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
