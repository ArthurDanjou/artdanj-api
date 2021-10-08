import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CommandsRun extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public commands: number

  @column.date({ autoCreate: true })
  public date: DateTime
}
