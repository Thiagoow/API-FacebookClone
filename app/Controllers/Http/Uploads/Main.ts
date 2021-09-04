import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class UploadsMainController {
  public async show({ params, response }: HttpContextContract) {
    //Faz o download do avatar do usuário e retorna como resposta:
    return response.download(Application.tmpPath('uploads', params.file))
  }
}
