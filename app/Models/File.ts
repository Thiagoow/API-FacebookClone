import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { FileCategory } from 'App/Utils'
//Pegando as variáveis do arquivo .env:
import Env from '@ioc:Adonis/Core/Env'

export default class File extends BaseModel {
  //serializeAs: null <- Não exibe esse campo na resposta
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: null })
  public ownerId: number

  @column({ serializeAs: null })
  public fileName: string

  @column({ serializeAs: null })
  public fileCategory: FileCategory

  //Coluna computada fictícia/não existente na dB:
  @computed()
  public get url(): string {
    //Retorna a URL para exibição do arquivo no na
    return `${Env.get('APP_URL')}/uploads/${this.fileName}`
  }
}
