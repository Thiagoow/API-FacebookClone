import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Conversation } from 'App/Models'

export default class ConversationsMainController {
  //Para listar todas as conversas:
  public async index({ auth }: HttpContextContract) {
    const user = auth.user!

    const conversations = await Conversation.query()
      .where({ userIdOne: user.id })
      .orWhere({ userIdTwo: user.id })
      .preload('userOne', (query) => {
        query.whereNot('id', user.id)
        query.preload('avatar')
      })
      .preload('userTwo', (query) => {
        query.whereNot('id', user.id)
        query.preload('avatar')
      })

    const newArray = conversations.map((conversation) => {
      const conversationInJSON = conversation.toJSON()

      conversationInJSON.user = conversation.userOne || conversation.userTwo

      delete conversationInJSON['userOne']
      delete conversationInJSON['userTwo']

      return conversationInJSON
    })

    return newArray
  }

  //Para exibir apenas uma conversa:
  public async show({ params, auth, response }: HttpContextContract) {
    //Pega a conversa X a partir do id enviado pela requisição:
    const conversation = await Conversation.findOrFail(params.id)

    /* Só carrega as mensagens e as conversas se o 
    id de user 1 ou 2 for IGUAL ao id do user que está tentando
    ver essas mensagens 😉: */
    if (![conversation.userIdOne, conversation.userIdTwo].includes(auth.user!.id)) {
      //Se não for:
      return response.unauthorized()
    }

    //Carrega as mensagens dessa conversa X:
    await conversation.load('messages')

    //Retorna a conversa:
    return conversation
  }

  //Para apagar uma conversa:
  public async destroy({ params, auth, response }: HttpContextContract) {
    const conversation = await Conversation.findOrFail(params.id)

    if (![conversation.userIdOne, conversation.userIdTwo].includes(auth.user!.id)) {
      return response.unauthorized()
    }

    await conversation.delete()
  }
}
