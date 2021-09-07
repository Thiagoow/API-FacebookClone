import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'
import { isFollowing } from 'App/Utils'

export default class MainProfilesController {
  public async show({ request, auth }: HttpContextContract) {
    const { username } = request.qs()

    //Busca a partir do username do usuário os dados:
    const user = await User.query()
      .where({ username })
      .preload('avatar')
      .withCount('posts')
      .withCount('followers')
      .withCount('following')
      .firstOrFail()

    /* Verifica se o user logado está visualizando o 
    perfil dele mesmo ou de outro usuário: */
    if (user.id !== auth.user!.id) {
      //Para saber se o usuário está ou não seguindo um outro:
      await isFollowing(user, auth)
    }

    return user.serialize({
      //Omite as seguintes informações do usuário:
      fields: {
        omit: ['email', 'createdAt', 'updatedAt', 'rememberMeToken'],
      },
    })
  }
}
