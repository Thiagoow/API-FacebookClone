import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      //Define que o e-mail deve ser ÚNICO, na tabela user e na coluna e-mail:
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    redirectUrl: schema.string({ trim: true }),
  })

  public messages = {}
}
