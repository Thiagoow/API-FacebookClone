import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'

/* Para que as requisições retornem as colunas como 
respostas em sintaxe camelCase, e não em snake_case: */
BaseModel.namingStrategy.serializedName = (_model, key) => {
  return string.camelCase(key)
}
