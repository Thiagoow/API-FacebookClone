import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/User/Register'
import { User } from 'App/Models'
//Gera id únicos e dados falsos/provisórios para testes auto
import faker from 'faker'

export default class RegisterController {
  public async store({ request }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)
    const user = await User.create({ email })

    await user.save()

    //Pega os relacionamentos do user e uma nova key:
    const key = faker.datatype.uuid() + user.id
    user.related('keys').create({ key })

    //Cria o link para ser enviado por e-mail:
    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`
    /* replace(/\/$/, '') -> Expressão regular a qual
    remove a barra / por uma string vazia,
    se a / já existir, evitando de que a URL
    fique inválida pela / duplicada, como:
    "facebook//register" */

    //Envia o link por e-mail:
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}
}
