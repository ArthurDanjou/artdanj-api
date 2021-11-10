import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Translation from 'App/Models/Translation'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Translation, {
    foreignKey: 'labelId',
  })
  public label: BelongsTo<typeof Translation>

  @column()
  public labelId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
