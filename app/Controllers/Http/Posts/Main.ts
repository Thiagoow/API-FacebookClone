import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post/Main'
import { User, Post } from 'App/Models'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'

export default class PostsMainController {
  public async index({ request, auth }: HttpContextContract) {
    const { username } = request.qs()

    //Busca um user pelo seu username:
    const user =
      (await User.findBy('username', username)) || auth.user! /* <- Caso o user autenticado tenha 
    digitado o username errado */

    //Carrega do post os dados:
    await user.load('posts', (query) => {
      //Carrega primeiro os posts mais recentes (id < pro >):
      query.orderBy('id', 'desc')
      query.preload('media')

      //Carrega a dB do user os dados:
      query.preload('user', (query) => {
        query.select(['id', 'name', 'username'])
        query.preload('avatar')
      })

      //Carrega a contagem de quantos comentários há na post:
      query.withCount('comments')
      //Carrega dos comentários os dados:
      query.preload('comments', (query) => {
        query.select(['userId', 'id', 'content', 'createdAt'])
        query.preload('user', (query) => {
          query.select(['id', 'name', 'username'])
          query.preload('avatar')
        })
      })

      //Carrega a contagem de cada um dos tipos das reações os dados:
      query.withCount('reactions', (query) => {
        query.where('type', 'like')
        query.as('likeCount')
      })
      query.withCount('reactions', (query) => {
        query.where('type', 'love')
        query.as('loveCount')
      })
      query.withCount('reactions', (query) => {
        query.where('type', 'haha')
        query.as('hahaCount')
      })
      query.withCount('reactions', (query) => {
        query.where('type', 'sad')
        query.as('sadCount')
      })
      query.withCount('reactions', (query) => {
        query.where('type', 'angry')
        query.as('angryCount')
      })

      //Para saber qual reação o usuário fez em cada post:
      query.preload('reactions', () => {
        /* Ou seja, reações que possuam um 'userId'
        igual ao id do user autenticado: */
        query.where('userId', auth.user!.id).first()
      })
    })

    //+ Retorna as postagens as quais pertencem a esse usuário:
    return user.posts
  }

  public async store({ request, auth }: HttpContextContract) {
    /* Pego os dados enviados pelo front end pra criar uma 
    postagem e valido com o validator: */
    const data = await request.validate(StoreValidator)
    /* Utilizo o relacionamento user autenticado com as postagens
    para criar uma nova postagem desse user, na tabela de post: */
    const post = await auth.user!.related('posts').create(data)

    //Retorno a postagem criada:
    return post
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    //Valido a requisição de update do front end com o:
    const data = await request.validate(UpdateValidator)
    //Encontra o post da requisição na dB ou falha:
    const post = await Post.findOrFail(params.id)

    /* Se o id do user logado/autenticado, que está tentando
    mudar os dados da publicação, não for IGUAL ao id do user que
    CRIOU a publicação: */
    if (auth.user!.id !== post.userId) {
      /* Retorna a resposta de não autorizado e 
      não atualiza/modifica a postagem:*/
      return response.unauthorized()
    }

    //Atualizo os dados da postagem e salvo na dB com o método 'merge()':
    await post.merge(data).save()
    //Retorno a postagem atualizada:
    return post
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    //Encontro a postagem na dB pelo id:
    const post = await Post.findOrFail(params.id)

    /* Se o id do user logado/autenticado, que está tentando
    DELETAR a publicação, não for IGUAL ao id do user que
    CRIOU a publicação: */
    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    //Mas se o user que tá tentando deletar = user que criou:
    await post.load('media')
    //Deleta da pasta tmp e da dB a mídia dessa postagem:
    if (post.media) {
      fs.unlinkSync(Application.tmpPath('uploads', post.media.fileName))
      await post.media.delete()
    }

    //Deleta a postagem
    await post.delete()
  }
}
