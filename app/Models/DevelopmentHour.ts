import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DevelopmentHour extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public seconds: number

  @column()
  public date: string
}
