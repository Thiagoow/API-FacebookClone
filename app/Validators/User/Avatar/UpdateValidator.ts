import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      //Tamanho máximo de upload:
      size: '5mb',
      //Aceita APENAS os arquivos de tipo:
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
