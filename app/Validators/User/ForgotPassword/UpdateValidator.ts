import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    //Precisa existir na tabela user_keys, na coluna 'key':
    key: schema.string({ trim: true }, [rules.exists({ table: 'user_keys', column: 'key' })]),
    name: schema.string({ trim: true }),
    password: schema.string({ trim: true }, [rules.confirmed('passwordConfirmation')]),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
