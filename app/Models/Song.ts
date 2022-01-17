import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Song extends BaseModel {
  public static table = 'spotify_songs_history'

  @column({ isPrimary: true })
  public date: Date

  @column()
  public device_name: string

  @column()
  public device_type: string

  @column()
  public item_name: string

  @column()
  public item_id: string

  @column()
  public item_type: string

  @column()
  public author: string

  @column()
  public image: string

  @column()
  public duration: number
}
