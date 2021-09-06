import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'
import { StoreValidator } from 'App/Validators/Post/Media'
import { Post } from 'App/Models'
//Cria um nome único para os arquivos de post:
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class MediaController {
  public async store({ request, response, auth, params }: HttpContextContract) {
    /* Usando a transaction pra caso der erro, desfazer TUDO a partir do
    '.useTransaction()' dentro dela: */
    await Database.transaction(async (trx) => {
      //Valida a requisição do front end e pega só o file dela:
      const { file } = await request.validate(StoreValidator)
      //Busca a postagem pelo id:
      const post = await Post.findOrFail(params.id)

      if (auth.user!.id !== post.userId) {
        return response.unauthorized()
      }

      //Desfaz tudo feito a partir daqui:
      post.useTransaction(trx)

      //Cria na dB o arquivo enviado pelo front end:
      const media = await post.related('media').create({
        fileCategory: 'post',
        fileName: `${cuid()}.${file.extname}`,
      })
      //Faz o upload desse arquivo pra aplicação:
      await file.move(Application.tmpPath('uploads'), {
        name: media.fileName,
      })
      //Retorna a mídia criada e enviada:
      return media
    })

    //Retorna pra API a mídia criada e enviada:
    //return sendMedia
  }
}
