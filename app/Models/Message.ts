import { BaseModel, column, belongsTo, BelongsTo, afterCreate } from '@ioc:Adonis/Lucid/Orm'
import { User, Conversation } from 'App/Models'
import Ws from 'App/Services/Ws'

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

  //Depois da criação da mensagem:
  @afterCreate()
  public static sendMessage(message: Message) {
    //Emite o evento 'newMessage' pra sala/conversa com id único:
    Ws.io.to(`room-${message.conversationId}`).emit('newMessage', {
      content: message.content,
      userId: message.userId,
    })
  }
}
