import {DateTime} from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";

export default class GuestBookMessage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public userId: number

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
