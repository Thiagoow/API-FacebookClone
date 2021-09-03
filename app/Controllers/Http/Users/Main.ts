import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/User/Main'

export default class UsersMainController {
  public async show({ auth }: HttpContextContract) {
    // Armazena na var user o usuário que DEVE estar autenticado:
    const user = auth.user!

    return user
  }

  public async update({ request, auth }: HttpContextContract) {
    //Recebe a request e valida com o validator se foi enviado corretamente tudo que era pedido:
    const data = await request.validate(UpdateValidator)
    //Cria o usuário que é verificado se existe com a middleware 😉:
    const user = auth.user!

    //Atualiza os atributos do usuário:
    user.merge(data)
    await user.save()

    //Retorna/devolve o usuário atualizado ;)
    return user
  }
}
