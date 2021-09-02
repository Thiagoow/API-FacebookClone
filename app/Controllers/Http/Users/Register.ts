import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/Register'
import { User, UserKey } from 'App/Models'
//Gera id únicos e dados falsos/provisórios para testes auto
import faker from 'faker'
//Módulo de e-mails do Adonis:
import Mail from '@ioc:Adonis/Addons/Mail'

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

    /* Envia o link por e-mail (com estilização já criada):
    Graças ao Adonis ser um MVC, e possuir a camada View + 
    os partials (estilizações individuais, presentes na pasta '@/resources' */
    await Mail.send((message) => {
      message.to(email)
      message.from('contato@facebookclone.com', 'Thiago - FacebookAdmin')
      message.subject('Criação de conta')
      //Onde está a view, estilização do e-mail:
      message.htmlView('emails/register', { link })
    })
  }

  public async show({ params }: HttpContextContract) {
    //Verifica se o userY com a keyX existe na dB:
    const userKey = await UserKey.findByOrFail('key', params.key)
    //Carrega o usuário a partir da key dele:
    await userKey.load('user')

    return userKey.user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, name, password } = await request.validate(UpdateValidator)

    //Verifica se o userY com a keyX existe na dB:
    const userKey = await UserKey.findByOrFail('key', key)
    //Carrega o usuário a partir da key dele:
    await userKey.load('user')

    /* Cria um username pro usuário:
    a partir do espaço entre as palavras do seu nome,
    pegando a primeira palavra, + o horário da alteração (para que ele seja
    único :D)*/
    const username = name.split('')[0].toLocaleLowerCase() + new Date().getTime()

    //Atualiza o nome, senha e username do usuário:
    userKey.user.merge({ name, password, username })
    await userKey.user.save()

    //Deleta a chave única temporária desse usuário para ativação do e-mail:
    await userKey.delete()

    return response.ok({ message: 'Usuário atualizado :D' })
  }
}
