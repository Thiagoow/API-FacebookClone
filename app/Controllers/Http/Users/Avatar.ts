import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/User/Avatar'
import { Application } from '@ioc:Adonis/Core/Application'
//Para usar no transaction:
import Database from '@ioc:Adonis/Lucid/Database'

export default class UserAvatarController {
  public async update({ request, auth }: HttpContextContract) {
    /* Database.transaction() -> Esse método serve quando
    sempre que tentarmos fazer alguma ação na dB, e ela não
    for bem sucedida, tal ação seja desfeita, invés de permanecer
    mesmo que seus primeiros códigos, na dB. */
    const response = await Database.transaction(async (trx) => {
      const { file } = await request.validate(UpdateValidator)
      //Carrega o usuário autenticado:
      const user = auth.user!.useTransaction(trx)

      /* firstOrCreate() -> Procura na dB ou cria um novo campo, 
      usando dois objetos: searchPayload e savePayload, no qual 
      o 1º é onde queremos buscar, e o 2º onde queremos criar o arquivo 😁😎 */
      const searchPayload = {} //<- ownerId: user.id
      const savePayload = {
        //Cria o avatar na categoria:
        fileCategory: 'avatar' as any,
        //Com o nome único para a dB -> 'XYZ.extensãoDoArquivo':
        fileName: `${new Date().getTime()}.${file.extname}`,
      }

      //Atualiza o avatar do user autenticado:
      const avatar = await user.related('avatar').firstOrCreate(searchPayload, savePayload)

      //Insere o avatar atualizado na dB:
      await file.move(Application.tmpPath('uploads'), {
        //Nome do arquivo físico a ser enviado pelo user:
        name: avatar.fileName,
        //Subscreve um arquivo antigo caso exista:
        overwrite: true,
      })

      //Retorna o avatar atualizado:
      return avatar
    })

    //Retorna pra API a resposta ;):
    return response
  }
}
