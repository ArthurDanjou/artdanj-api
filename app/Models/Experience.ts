import type { DateTime } from 'luxon'
import type { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Translation from 'App/Models/Translation'

export default class Experience extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Translation, {
    foreignKey: 'titleId',
  })
  public title: BelongsTo<typeof Translation>

  @column()
  public titleId: number

  @column()
  public company: string

  @column()
  public location: string

  @column()
  public beginDate: string

  @column()
  public endDate: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
