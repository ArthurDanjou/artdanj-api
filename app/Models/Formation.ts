import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Translation from 'App/Models/Translation'

export default class Formation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Translation, {
    foreignKey: 'titleId',
  })
  public title: BelongsTo<typeof Translation>

  @column()
  public titleId: number

  @belongsTo(() => Translation, {
    foreignKey: 'descriptionId',
  })
  public description: BelongsTo<typeof Translation>

  @column()
  public descriptionId: number

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
