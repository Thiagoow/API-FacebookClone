import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      //Procura se o e-mail existe na tabela user, na coluna e-mail:
      rules.exists({ table: 'users', column: 'email' }),
    ]),
    redirectUrl: schema.string({ trim: true }),
  })

  public messages = {}
}
