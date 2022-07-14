import type { DateTime } from 'luxon'
import type { BelongsTo, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, belongsTo, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import File from 'App/Models/File'
import Tag from 'App/Models/Tag'
import Translation from 'App/Models/Translation'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @belongsTo(() => Translation, {
    foreignKey: 'descriptionId',
  })
  public description: BelongsTo<typeof Translation>

  @column()
  public descriptionId: number

  @column()
  public url: string

  @belongsTo(() => File, {
    foreignKey: 'coverId',
  })
  public cover: BelongsTo<typeof File>

  @column()
  public coverId: number

  @manyToMany(() => Tag)
  public tags: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
