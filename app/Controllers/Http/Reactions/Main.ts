import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Post, Reaction } from 'App/Models'
import { UpdateValidator } from 'App/Validators/Reactions'

export default class ReactionsMainController {
  public async update({ request, auth }: HttpContextContract) {
    /* Desestruturo da requisição qual o tipo/categoria da reação e 
    a qual postagem ela pertence: */
    const { type, postId } = await request.validate(UpdateValidator)
    //Busca a postagem pelo id da requisição:
    const post = await Post.findOrFail(postId)

    /* updateOrCreate() -> Procura na dB ou cria um novo campo, 
      usando dois objetos: searchPayload e savePayload, no qual 
      o 1º é onde queremos buscar, e o 2º onde queremos atualizar 😁😎 */
    const searchPayload = { postId, userId: auth.user!.id }
    const savePayload = { type }
    const reaction = await post.related('reactions').updateOrCreate(searchPayload, savePayload)

    return reaction
  }

  public async destroy({ params }: HttpContextContract) {
    //Encontra a reação pelo id
    const reaction = await Reaction.findOrFail(params.id)
    //Deleta a reação:
    await reaction.delete()
  }
}
