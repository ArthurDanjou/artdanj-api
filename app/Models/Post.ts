import { DateTime } from 'luxon'
import {BaseModel, column, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import Tag from "App/Models/Tag";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @manyToMany(() => Tag)
  public tags: ManyToMany<typeof Tag>

  @column()
  public slug: string

  @column()
  public likes: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
