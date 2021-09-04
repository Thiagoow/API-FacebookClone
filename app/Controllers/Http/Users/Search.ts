import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { isFollowing } from 'App/Utils'

export default class UserSearchController {
  public async index({ request, response, auth }: HttpContextContract) {
    const { keyword } = request.qs()

    //Se não houver uma keyword definida:
    if (!keyword) {
      return response.status(422).send({
        error: { message: 'Digite um usuário para pesquisá-lo :)' },
      })
    }

    //Pesquisa usuários com email, nome e usernames parecidos com a keyword:
    const users = await User.query()
      .where('email', 'like', `%${keyword}%`)
      .orWhere('name', 'like', `%${keyword}%`)
      .orWhere('username', 'like', `%${keyword}%`)
      .preload('avatar')
    //Carrega quais usuários seguem ou não o usuário logado/autenticado:
    const queries = users.map(async (user) => {
      await isFollowing(user, auth)
    })
    await Promise.all(queries)

    /* Retorna todos os usuários que se enquadram na busca 
    acima + que possuem id diferente do usuário que está pesquisando
    + omitindo o e-mail de cada um desses usuários 😁: */
    return users
      .filter(({ id }) => id !== auth.user!.id)
      .map((user) => {
        return user.serialize({
          fields: {
            omit: ['email'],
          },
        })
      })
  }
}
