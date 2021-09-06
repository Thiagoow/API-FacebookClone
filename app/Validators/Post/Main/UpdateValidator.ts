import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    //Atualiza a string opcional de descrição da postagem:
    description: schema.string.optional({ trim: true }),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
