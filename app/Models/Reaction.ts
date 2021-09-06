import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { ReactionsCategories } from 'App/Utils'

export default class Reaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: ReactionsCategories

  @column()
  public userId: number

  @column()
  public postId: number
}
