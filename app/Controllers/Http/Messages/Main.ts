import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/Message'
import { Conversation } from 'App/Models'

export default class MessagesMainController {
  public async store({ request, response, auth }: HttpContextContract) {
    //Valida a requisição:
    const { content, receiverId } = await request.validate(StoreValidator)

    //Dá erro se o user tentar mandar uma mnsg pra ele mesmo:
    if (auth.user!.id === receiverId) {
      return response.badRequest()
    }

    //Verifica se já existe uma conversa do user logado com o outro:
    const existingConversation = await Conversation.query()
      //Onde o user logado tem o userId1:
      .where({ userIdOne: auth.user!.id, userIdTwo: receiverId })
      //Ou onde o user logado tem o userId2:
      .orWhere({ userIdOne: receiverId, userIdTwo: auth.user!.id })
      //Traz apenas o primeiro resultado dessa busca:
      .first()

    //Se sim apenas envia uma mensagem pra conversa já existente entre os 2 users:
    if (existingConversation) {
      const message = await existingConversation.related('messages').create({
        content,
        userId: auth.user!.id,
      })
      return message
    }

    //Senão cria uma nova conversa entre os dois users:
    const conversation = await Conversation.create({
      userIdOne: auth.user!.id,
      userIdTwo: receiverId,
    })
    //E envia a mensagem para o user, nessa conversa criada ACIMA ^:
    const message = await conversation.related('messages').create({
      content,
      userId: auth.user!.id,
    })
    return message
  }

  public async destroy({}: HttpContextContract) {}
}
