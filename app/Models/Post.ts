import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import Tag from "App/Models/Tag";
import Translation from "App/Models/Translation";
import File from "App/Models/File";
import PostColor from "App/Models/PostColor";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @manyToMany(() => Tag)
  public tags: ManyToMany<typeof Tag>

  @column()
  public slug: string

  @column()
  public likes: number

  @belongsTo(() => Translation, {
    foreignKey: 'titleId'
  })
  public title: BelongsTo<typeof Translation>

  @column()
  public titleId: number

  @belongsTo(() => Translation, {
    foreignKey: 'descriptionId'
  })
  public description: BelongsTo<typeof Translation>

  @column()
  public descriptionId: number

  @belongsTo(() => File, {
    foreignKey: 'coverId'
  })
  public cover: BelongsTo<typeof File>

  @column()
  public coverId: number

  @belongsTo(() => Translation, {
    foreignKey: 'contentId'
  })
  public content: BelongsTo<typeof Translation>

  @column()
  public contentId: number

  @belongsTo(() => PostColor, {
    foreignKey: 'postColorId'
  })
  public color: BelongsTo<typeof PostColor>

  @column()
  public postColorId: number

  @column()
  public readingTime: number

  @column()
  public date: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
