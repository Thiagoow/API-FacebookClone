import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }),
    username: schema.string({ trim: true }),
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string.optional({ trim: true }, [rules.confirmed('passwordConfirmation')]),
  })

  public messages = {}
}
