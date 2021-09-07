import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { User, Conversation } from 'App/Models'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public conversationId: number

  @column()
  public content: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Conversation)
  public conversation: BelongsTo<typeof Conversation>
}
