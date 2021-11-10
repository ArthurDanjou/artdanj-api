import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Translation from 'App/Models/Translation'

export default class Maintenance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public active: boolean

  @belongsTo(() => Translation, {
    foreignKey: 'reasonId',
  })
  public reason: BelongsTo<typeof Translation>

  @column()
  public reasonId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
