import {DateTime} from 'luxon'
import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public age: number

  @column()
  public hiringStatus: string

  @column()
  public hiringColor: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
