import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      //Tamanho máximo de upload:
      size: '10mb',
      //Aceita APENAS os arquivos de tipo:
      extnames: ['jpg', 'png', 'jpeg', 'svg'],
    }),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
