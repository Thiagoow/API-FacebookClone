import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { reactionsCategories } from 'App/Utils'

export default class UpdateValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum(reactionsCategories),
    postId: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
