import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Location extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.date({ autoCreate: true })
  public since: DateTime

  @column()
  public place: string

  @column()
  public left: string
}
