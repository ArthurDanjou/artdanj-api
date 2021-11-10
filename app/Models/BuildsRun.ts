import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class BuildsRun extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public builds: number

  @column()
  public date: string
}
