import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { FileCategory } from 'App/Utils'
//Pegando as variáveis do arquivo .env:
import Env from '@ioc:Adonis/Core/Env'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null }) //<- Não exibe como resposta
  public ownerId: number

  @column({ serializeAs: null }) //<- Não exibe como resposta
  public fileName: string

  @column({ serializeAs: null }) //<- Não exibe como resposta
  public fileCategory: FileCategory

  //Coluna computada fictícia/não existente na dB:
  @computed()
  public get url(): string {
    //Retorna a URL para exibição do arquivo no navegador:
    return `${Env.get('APP_URL')}/uploads/${this.fileName}`
  }
}
