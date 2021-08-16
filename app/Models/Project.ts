import {DateTime} from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import File from "App/Models/File";
import Tag from "App/Models/Tag";

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public progress: number

  @column()
  public url: string

  @belongsTo(() => File, {
    foreignKey: 'coverId'
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
